export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getQuoteById } from '@/lib/imitationDb'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const quoteId = Number(id)

  if (!Number.isInteger(quoteId)) {
    return withCors(request, { error: 'Quote id must be an integer' }, { status: 400 })
  }

  const quote = getQuoteById(quoteId)

  if (!quote) {
    return withCors(request, { error: 'Quote not found' }, { status: 404 })
  }

  return withCors(request, { item: quote })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
