export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { queryQuotes, QuoteFilters } from '@/lib/imitationDb'

function intParam(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : undefined
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const filters: QuoteFilters = {
    book: intParam(params.get('book')),
    article: intParam(params.get('article')),
    day: intParam(params.get('day')),
    date: params.get('date') || undefined,
    topic: params.get('topic') || undefined,
    q: params.get('q') || undefined,
    limit: intParam(params.get('limit')),
    offset: intParam(params.get('offset')),
  }

  if (params.get('book') && !filters.book) {
    return withCors(request, { error: 'book must be an integer' }, { status: 400 })
  }

  if (params.get('article') && !filters.article) {
    return withCors(request, { error: 'article must be an integer article id' }, { status: 400 })
  }

  if (params.get('day') && (!filters.day || filters.day < 1 || filters.day > 365)) {
    return withCors(request, { error: 'day must be an integer from 1 to 365' }, { status: 400 })
  }

  if (filters.date && !/^\d{2}-\d{2}$/.test(filters.date)) {
    return withCors(request, { error: 'date must use MM-DD format' }, { status: 400 })
  }

  return withCors(request, queryQuotes(filters))
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
