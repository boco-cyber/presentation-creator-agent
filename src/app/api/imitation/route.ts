export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getImitationDataset, getTopics } from '@/lib/imitationDb'

export async function GET(request: NextRequest) {
  const dataset = getImitationDataset()

  return withCors(request, {
    name: 'The Imitation of Christ Daily Quotes API',
    source: dataset.source,
    calendar: dataset.calendar,
    counts: {
      books: dataset.books.length,
      articles: dataset.articles.length,
      topics: getTopics().length,
      quotes: dataset.quotes.length,
    },
    endpoints: {
      books: '/api/imitation/books',
      articles: '/api/imitation/articles',
      topics: '/api/imitation/topics',
      quotes: '/api/imitation/quotes',
      today: '/api/imitation/quotes/today',
    },
  })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
