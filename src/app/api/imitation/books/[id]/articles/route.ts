export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getArticles, getBooks } from '@/lib/imitationDb'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const bookId = Number(id)
  const book = getBooks().find(item => item.id === bookId)

  if (!book) {
    return withCors(request, { error: 'Book not found' }, { status: 404 })
  }

  return withCors(request, {
    book,
    items: getArticles(bookId),
  })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
