import fs from 'fs'
import path from 'path'

export interface ImitationBook {
  id: number
  title: string
}

export interface ImitationArticle {
  id: number
  book_number: number
  book_title: string
  article_number: number
  article_title: string
  body: null
}

export interface ImitationQuote {
  id: number
  day_of_year: number
  calendar_date: string
  book_number: number
  book_title: string
  article_id: number
  article_number: number
  article_title: string
  sentence_index: number
  topic: string
  title: string
  quote: string
}

interface ImitationDataset {
  source: string
  calendar: string
  books: ImitationBook[]
  articles: ImitationArticle[]
  quotes: ImitationQuote[]
}

export interface QuoteFilters {
  book?: number
  article?: number
  topic?: string
  day?: number
  date?: string
  q?: string
  limit?: number
  offset?: number
}

export interface PaginatedQuotes {
  items: ImitationQuote[]
  total: number
  limit: number
  offset: number
}

let cachedDataset: ImitationDataset | null = null

function datasetPath(): string {
  return process.env.IMITATION_QUOTES_JSON
    ? path.resolve(process.env.IMITATION_QUOTES_JSON)
    : path.join(process.cwd(), 'data', 'imitation_daily_quotes.json')
}

export function getImitationDataset(): ImitationDataset {
  if (cachedDataset) return cachedDataset

  const raw = fs.readFileSync(datasetPath(), 'utf8')
  cachedDataset = JSON.parse(raw) as ImitationDataset
  return cachedDataset
}

export function getBooks(): ImitationBook[] {
  return getImitationDataset().books
}

export function getTopics(): { id: string; name: string; quoteCount: number }[] {
  const counts = new Map<string, number>()
  for (const quote of getImitationDataset().quotes) {
    counts.set(quote.topic, (counts.get(quote.topic) || 0) + 1)
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, quoteCount]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name,
      quoteCount,
    }))
}

export function getArticles(book?: number): ImitationArticle[] {
  const articles = getImitationDataset().articles
  return book ? articles.filter(article => article.book_number === book) : articles
}

export function getQuoteById(id: number): ImitationQuote | undefined {
  return getImitationDataset().quotes.find(quote => quote.id === id)
}

export function getDailyQuote(inputDate = new Date()): ImitationQuote {
  const month = String(inputDate.getMonth() + 1).padStart(2, '0')
  const day = String(inputDate.getDate()).padStart(2, '0')
  const calendarDate = `${month}-${day}`
  const quotes = getImitationDataset().quotes

  if (calendarDate === '02-29') {
    return quotes.find(quote => quote.calendar_date === '02-28') || quotes[0]
  }

  return quotes.find(quote => quote.calendar_date === calendarDate) || quotes[0]
}

export function queryQuotes(filters: QuoteFilters): PaginatedQuotes {
  const limit = Math.max(1, Math.min(filters.limit || 30, 100))
  const offset = Math.max(0, filters.offset || 0)
  const q = filters.q?.trim().toLowerCase()
  const topic = filters.topic?.trim().toLowerCase()

  const filtered = getImitationDataset().quotes.filter(quote => {
    if (filters.book && quote.book_number !== filters.book) return false
    if (filters.article && quote.article_id !== filters.article) return false
    if (filters.day && quote.day_of_year !== filters.day) return false
    if (filters.date && quote.calendar_date !== filters.date) return false
    if (topic && quote.topic.toLowerCase() !== topic) return false
    if (q) {
      const searchable = `${quote.title} ${quote.quote} ${quote.topic} ${quote.article_title}`.toLowerCase()
      if (!searchable.includes(q)) return false
    }
    return true
  })

  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
    limit,
    offset,
  }
}
