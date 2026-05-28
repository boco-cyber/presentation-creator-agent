export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getArticles } from '@/lib/imitationDb'

export async function GET(request: NextRequest) {
  const book = request.nextUrl.searchParams.get('book')
  const bookId = book ? Number(book) : undefined

  if (book && (!Number.isInteger(bookId) || Number(bookId) < 1 || Number(bookId) > 4)) {
    return withCors(request, { error: 'book must be a number from 1 to 4' }, { status: 400 })
  }

  return withCors(request, { items: getArticles(bookId) })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
