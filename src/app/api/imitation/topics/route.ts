export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { corsOptions, withCors } from '@/lib/apiResponse'
import { getTopics } from '@/lib/imitationDb'

export async function GET(request: NextRequest) {
  return withCors(request, { items: getTopics() })
}

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}
