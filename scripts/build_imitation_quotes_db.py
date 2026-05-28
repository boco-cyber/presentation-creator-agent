from __future__ import annotations

import json
import re
import sqlite3
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW_TEXT = ROOT / "data" / "imitation-of-christ.raw.txt"
JSON_OUT = ROOT / "data" / "imitation_daily_quotes.json"
SQLITE_OUT = ROOT / "data" / "imitation_daily_quotes.sqlite"


BOOK_TITLES = {
    1: "Thoughts Helpful in the Life of the Soul",
    2: "The Interior Life",
    3: "Internal Consolation",
    4: "An Invitation to Holy Communion",
}

ORDINALS = {
    "First": 1,
    "Second": 2,
    "Third": 3,
    "Fourth": 4,
    "Fifth": 5,
    "Sixth": 6,
    "Seventh": 7,
    "Eighth": 8,
    "Ninth": 9,
    "Tenth": 10,
    "Eleventh": 11,
    "Twelfth": 12,
    "Thirteenth": 13,
    "Fourteenth": 14,
    "Fifteenth": 15,
    "Sixteenth": 16,
    "Seventeenth": 17,
    "Eighteenth": 18,
    "Nineteenth": 19,
    "Twentieth": 20,
    "Twenty-First": 21,
    "Twenty-Second": 22,
    "Twenty-Third": 23,
    "Twenty-Fourth": 24,
    "Twenty-Fifth": 25,
    "Twenty-Sixth": 26,
    "Twenty-Seventh": 27,
    "Twenty-Eighth": 28,
    "Twenty-Ninth": 29,
    "Thirtieth": 30,
    "Thirty-First": 31,
    "Thirty-Second": 32,
    "Thirty-Third": 33,
    "Thirty-Fourth": 34,
    "Thirty-Fifth": 35,
    "Thirty-Sixth": 36,
    "Thirty-Seventh": 37,
    "Thirty-Eighth": 38,
    "Thirty-Ninth": 39,
    "Fortieth": 40,
    "Forty-First": 41,
    "Forty-Second": 42,
    "Forty-Third": 43,
    "Forty-Fourth": 44,
    "Forty-Fifth": 45,
    "Forty-Sixth": 46,
    "Forty-Seventh": 47,
    "Forty-Eighth": 48,
    "Forty-Ninth": 49,
    "Fiftieth": 50,
    "Fifty-First": 51,
    "Fifty-Second": 52,
    "Fifty-Third": 53,
    "Fifty-Fourth": 54,
    "Fifty-Fifth": 55,
    "Fifty-Sixth": 56,
    "Fifty-Seventh": 57,
    "Fifty-Eighth": 58,
    "Fifty-Ninth": 59,
}

TOPIC_RULES = [
    ("Humility", ("humble", "humility", "self-abasement", "meek")),
    ("Prayer", ("pray", "prayer", "ask", "call upon", "petition")),
    ("Love of God", ("love god", "love of god", "love me", "beloved", "charity")),
    ("Christlike Living", ("christ", "jesus", "imitate", "cross")),
    ("Detachment", ("world", "earthly", "creature", "riches", "vanity", "honor")),
    ("Patience", ("patient", "patience", "suffer", "trial", "adversity", "trouble")),
    ("Peace", ("peace", "rest", "quiet", "tranquil")),
    ("Obedience", ("obey", "obedience", "subject", "submit", "submission")),
    ("Conscience", ("conscience", "sin", "fault", "purity", "contrition")),
    ("Grace", ("grace", "gift", "mercy", "blessing")),
    ("Wisdom", ("truth", "wisdom", "knowledge", "learn", "scripture")),
    ("Communion", ("communion", "sacrament", "altar", "body of christ", "receive christ")),
    ("Eternal Life", ("eternal", "heaven", "kingdom", "death", "judgment")),
    ("Self-Denial", ("deny", "self", "renounce", "desire", "appetite")),
]

STOPWORDS = {
    "about",
    "above",
    "after",
    "against",
    "alone",
    "also",
    "because",
    "before",
    "being",
    "christ",
    "every",
    "great",
    "himself",
    "indeed",
    "jesus",
    "little",
    "should",
    "their",
    "there",
    "these",
    "things",
    "those",
    "through",
    "where",
    "which",
    "while",
    "without",
    "would",
    "yourself",
}


@dataclass
class Article:
    id: int
    book_number: int
    book_title: str
    article_number: int
    article_title: str
    body: str


def clean_text(text: str) -> str:
    replacements = {
        "Ã€": "A",
        "Ã©": "e",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "â€“": "-",
        "â€”": "--",
        "Â©": "(c)",
        "Â®": "(R)",
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    text = re.sub(r"\n-- \d+ of \d+ --\n", "\n", text)
    text = re.sub(r"\b\d+(John|Eccles|Rom|Matt|Luke|Ps|Phil|Cor|Pet|Tim)\. [^\n]+", "", text)
    text = re.sub(r"(?m)^\d+[A-Z][^\n]*$", "", text)
    return text


def normalize_heading(line: str) -> str:
    line = re.sub(r"\s+", " ", line).strip()
    for bad, good in {
        "W E": "WE",
        "H E": "HE",
        "I T": "IT",
        "N O": "NO",
        "D O": "DO",
        "O F": "OF",
        "O UGHT": "OUGHT",
        "I N": "IN",
        "I S": "IS",
        "A RE": "ARE",
    }.items():
        line = line.replace(bad, good)
    line = re.sub(r"\b([A-Z])\s+([A-Z]{2,})", r"\1\2", line)
    line = re.sub(r"\s+([,.;:!?])", r"\1", line)
    line = line.title().replace("God'S", "God's").replace("Man'S", "Man's")
    line = re.sub(
        r"\bA(Humble|Good|Free|Faithful|Man|True|Devout|Desolate)\b",
        lambda match: f"A {match.group(1).capitalize()}",
        line,
        flags=re.IGNORECASE,
    )
    line = line.replace(" -", "-").replace("- ", "-")
    line = re.sub(
        r"([a-z])(of|to|in|on|and)\b",
        lambda match: f"{match.group(1)} {match.group(2).title()}",
        line,
        flags=re.IGNORECASE,
    )
    return line


def is_heading_line(line: str) -> bool:
    letters = [char for char in line if char.isalpha()]
    if not letters:
        return False
    uppercase_ratio = sum(char.isupper() for char in letters) / len(letters)
    return uppercase_ratio > 0.72


def is_title_case_heading(line: str) -> bool:
    words = re.findall(r"[A-Za-z]+", line)
    if not words:
        return False
    return sum(word[0].isupper() for word in words) / len(words) > 0.75


def parse_articles(text: str) -> list[Article]:
    lines = clean_text(text).splitlines()
    start = next(i for i, line in enumerate(lines) if i > 100 and line.strip() == "BOOK ONE")
    articles: list[Article] = []
    current_book = 0
    i = start

    while i < len(lines):
        line = lines[i].strip()
        book_match = re.fullmatch(r"BOOK (ONE|TWO|THREE|FOUR)", line)
        if book_match:
            current_book = ["ONE", "TWO", "THREE", "FOUR"].index(book_match.group(1)) + 1
            i += 1
            continue

        chapter_match = re.fullmatch(r"The ([A-Za-z-]+) Chapter", line)
        if chapter_match and current_book:
            ordinal = "-".join(part.capitalize() for part in chapter_match.group(1).split("-"))
            article_number = ORDINALS[ordinal]
            title_parts: list[str] = []
            i += 1
            while i < len(lines) and lines[i].strip() == "":
                i += 1
            while i < len(lines):
                candidate = lines[i].strip()
                if not candidate:
                    i += 1
                    break
                if re.fullmatch(r"BOOK (ONE|TWO|THREE|FOUR)", candidate):
                    break
                if re.fullmatch(r"The ([A-Za-z-]+) Chapter", candidate):
                    break
                normalized_candidate = normalize_heading(candidate).upper()
                if normalized_candidate in {"THE DISCIPLE", "THE VOICE OF CHRIST"}:
                    break
                if (
                    (re.search(r"[.!?]$", candidate) and not is_heading_line(candidate))
                    or len(normalize_heading(candidate).split()) > 20
                    or not (is_heading_line(candidate) or (not title_parts and is_title_case_heading(candidate)))
                ):
                    break
                title_parts.append(candidate)
                i += 1

            body_parts: list[str] = []
            while i < len(lines):
                candidate = lines[i].strip()
                if re.fullmatch(r"BOOK (ONE|TWO|THREE|FOUR)", candidate):
                    break
                if re.fullmatch(r"The ([A-Za-z-]+) Chapter", candidate):
                    break
                body_parts.append(candidate)
                i += 1

            body = re.sub(r"\s+", " ", " ".join(body_parts)).strip()
            articles.append(
                Article(
                    id=len(articles) + 1,
                    book_number=current_book,
                    book_title=BOOK_TITLES[current_book],
                    article_number=article_number,
                    article_title=normalize_heading(" ".join(title_parts)),
                    body=body,
                )
            )
            continue

        i += 1

    return articles


def split_sentences(body: str) -> list[str]:
    body = re.sub(r"(?<=[.!?])\d+\s+", " ", body)
    body = re.sub(r"\s+\d+(?=[A-Z])", " ", body)
    body = re.sub(r"\s+", " ", body).strip()
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", body)
    quotes = []
    for sentence in sentences:
        sentence = sentence.strip(" ;")
        words = sentence.split()
        if (
            10 <= len(words) <= 42
            and not sentence.startswith(("THE ", "BOOK "))
            and re.match(r'^[A-Z"]', sentence)
        ):
            quotes.append(sentence)
    return quotes


def topic_for(text: str, fallback_title: str) -> str:
    combined = f"{fallback_title} {text}".lower()
    scores = Counter()
    for topic, needles in TOPIC_RULES:
        scores[topic] = sum(combined.count(needle) for needle in needles)
    topic, score = scores.most_common(1)[0]
    return topic if score else "Spiritual Growth"


def title_for(quote: str, topic: str) -> str:
    title_source = re.sub(r'[,;]?\s*"?\s*says the Lord\.?$', "", quote, flags=re.IGNORECASE)
    title_source = re.split(r"[.;:!?]", title_source, maxsplit=1)[0]
    words = re.findall(r"[A-Za-z']+", title_source)
    while words and words[0].lower() in {"and", "but", "for", "now", "therefore", "indeed"}:
        words.pop(0)
    title_words = [word.strip("'").title() for word in words[:8]]
    if len(title_words) >= 3:
        return " ".join(title_words)[:80]

    meaningful = [
        word.strip("'").title()
        for word in re.findall(r"[A-Za-z']+", quote)
        if len(word) > 3 and word.lower() not in STOPWORDS
    ]
    return (" ".join(meaningful[:4]) if meaningful else topic)[:80]


def date_for_day(day: int) -> str:
    # A non-leap devotional calendar: day 60 is Mar 1, with no Feb 29 entry.
    return (date(2025, 1, 1) + timedelta(days=day - 1)).strftime("%m-%d")


def build_daily_quotes(articles: list[Article]) -> list[dict]:
    candidates: list[dict] = []
    for article in articles:
        for sentence_index, quote in enumerate(split_sentences(article.body), start=1):
            topic = topic_for(quote, article.article_title)
            candidates.append(
                {
                    "book_number": article.book_number,
                    "book_title": article.book_title,
                    "article_id": article.id,
                    "article_number": article.article_number,
                    "article_title": article.article_title,
                    "sentence_index": sentence_index,
                    "topic": topic,
                    "title": title_for(quote, topic),
                    "quote": quote,
                }
            )

    by_article: dict[int, list[dict]] = defaultdict(list)
    for candidate in candidates:
        by_article[candidate["article_id"]].append(candidate)

    selected: list[dict] = []
    round_index = 0
    while len(selected) < 365:
        added = False
        for article in articles:
            bucket = by_article[article.id]
            if round_index < len(bucket):
                selected.append(bucket[round_index])
                added = True
                if len(selected) == 365:
                    break
        if not added:
            break
        round_index += 1

    if len(selected) != 365:
        raise RuntimeError(f"Expected 365 quotes, found {len(selected)}")

    for day, item in enumerate(selected, start=1):
        item["day_of_year"] = day
        item["calendar_date"] = date_for_day(day)
        item["id"] = day
    return selected


def write_sqlite(articles: list[Article], quotes: list[dict]) -> None:
    if SQLITE_OUT.exists():
        SQLITE_OUT.unlink()
    con = sqlite3.connect(SQLITE_OUT)
    con.executescript(
        """
        PRAGMA foreign_keys = ON;

        CREATE TABLE books (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL
        );

        CREATE TABLE articles (
          id INTEGER PRIMARY KEY,
          book_id INTEGER NOT NULL REFERENCES books(id),
          article_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          UNIQUE(book_id, article_number)
        );

        CREATE TABLE topics (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE quotes (
          id INTEGER PRIMARY KEY,
          day_of_year INTEGER NOT NULL UNIQUE,
          calendar_date TEXT NOT NULL,
          book_id INTEGER NOT NULL REFERENCES books(id),
          article_id INTEGER NOT NULL REFERENCES articles(id),
          topic_id INTEGER NOT NULL REFERENCES topics(id),
          title TEXT NOT NULL,
          quote TEXT NOT NULL,
          sentence_index INTEGER NOT NULL
        );

        CREATE INDEX idx_quotes_calendar_date ON quotes(calendar_date);
        CREATE INDEX idx_quotes_topic_id ON quotes(topic_id);
        CREATE INDEX idx_quotes_book_article ON quotes(book_id, article_id);
        """
    )
    con.executemany("INSERT INTO books(id, title) VALUES(?, ?)", BOOK_TITLES.items())
    con.executemany(
        "INSERT INTO articles(id, book_id, article_number, title) VALUES(?, ?, ?, ?)",
        [(a.id, a.book_number, a.article_number, a.article_title) for a in articles],
    )
    topics = sorted({quote["topic"] for quote in quotes})
    topic_ids = {name: i for i, name in enumerate(topics, start=1)}
    con.executemany("INSERT INTO topics(id, name) VALUES(?, ?)", [(i, name) for name, i in topic_ids.items()])
    con.executemany(
        """
        INSERT INTO quotes(
          id, day_of_year, calendar_date, book_id, article_id, topic_id, title, quote, sentence_index
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                quote["id"],
                quote["day_of_year"],
                quote["calendar_date"],
                quote["book_number"],
                quote["article_id"],
                topic_ids[quote["topic"]],
                quote["title"],
                quote["quote"],
                quote["sentence_index"],
            )
            for quote in quotes
        ],
    )
    con.commit()
    con.close()


def main() -> None:
    if not RAW_TEXT.exists():
        raise SystemExit(f"Missing {RAW_TEXT}. Run: node scripts/extract_imitation_text.mjs")
    articles = parse_articles(RAW_TEXT.read_text(encoding="utf8"))
    quotes = build_daily_quotes(articles)
    JSON_OUT.write_text(
        json.dumps(
            {
                "source": "Thomas A Kempis, The Imitation of Christ",
                "calendar": "365-day non-leap devotional calendar",
                "books": [{"id": k, "title": v} for k, v in BOOK_TITLES.items()],
                "articles": [article.__dict__ | {"body": None} for article in articles],
                "quotes": quotes,
            },
            indent=2,
        ),
        encoding="utf8",
    )
    write_sqlite(articles, quotes)
    print(f"Parsed {len(articles)} articles")
    print(f"Wrote {len(quotes)} quotes to {JSON_OUT.relative_to(ROOT)}")
    print(f"Wrote SQLite database to {SQLITE_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
