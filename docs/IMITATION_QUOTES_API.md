# Imitation Quotes API

Read-only backend API for the 365 daily quotes database generated from *The Imitation of Christ*.

## Endpoints

- `GET /api/imitation` - API metadata and route list
- `GET /api/imitation/books` - books with article counts
- `GET /api/imitation/articles?book=1` - articles, optionally filtered by book
- `GET /api/imitation/books/1/articles` - articles for one book
- `GET /api/imitation/topics` - topics with quote counts
- `GET /api/imitation/quotes` - paginated quotes
- `GET /api/imitation/quotes/today` - quote for today's month/day
- `GET /api/imitation/quotes/today?date=2026-05-28` - quote for a specific date
- `GET /api/imitation/quotes/42` - quote by id

## Quote Filters

`GET /api/imitation/quotes` accepts:

- `book=1`
- `article=12`
- `topic=Prayer`
- `day=148`
- `date=05-28`
- `q=humility`
- `limit=30` up to `100`
- `offset=0`

Example:

```bash
curl "https://your-domain.com/api/imitation/quotes?topic=Prayer&limit=5"
```

## Response Shape

Quote records include:

```json
{
  "id": 148,
  "day_of_year": 148,
  "calendar_date": "05-28",
  "book_number": 3,
  "book_title": "Internal Consolation",
  "article_id": 34,
  "article_number": 2,
  "article_title": "Truth Speaks Inwardly Without The Sound Of Words",
  "topic": "Prayer",
  "title": "Example Title",
  "quote": "Example quote text."
}
```

## Coolify Deployment

Create a new Coolify application from this Git repository and use Docker build mode.

Recommended settings:

- Build pack: `Dockerfile`
- Port: `3000`
- Health check path: `/api/imitation`
- Environment:
  - `NODE_ENV=production`
  - `API_CORS_ORIGIN=*` or your exact web/mobile origins
  - `NEXT_PUBLIC_APP_NAME=Presentation Creator Agent`

The Docker image copies `data/imitation_daily_quotes.json` and `data/imitation_daily_quotes.sqlite` into the container. The API reads from the JSON mirror at runtime; the SQLite file remains available as a portable database artifact.
