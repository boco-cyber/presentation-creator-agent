export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getArticles, getBooks } from '@/lib/imitationDb'

export async function GET(request: NextRequest) {
  const articles = getArticles()

  return withCors(request, {
    items: getBooks().map(book => ({
      ...book,
      articleCount: articles.filter(article => article.book_number === book.id).length,
    })),
  })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
