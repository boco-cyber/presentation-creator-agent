import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_METHODS = 'GET, OPTIONS'
const DEFAULT_HEADERS = 'Content-Type, Authorization, X-API-Key'

function corsOrigin(request: NextRequest): string {
  const configured = process.env.API_CORS_ORIGIN || '*'
  const requestOrigin = request.headers.get('origin')

  if (configured === '*') return '*'
  if (!requestOrigin) return configured.split(',')[0]?.trim() || '*'

  const allowed = configured.split(',').map(origin => origin.trim()).filter(Boolean)
  return allowed.includes(requestOrigin) ? requestOrigin : allowed[0] || '*'
}

export function withCors<T>(
  request: NextRequest,
  body: T,
  init: ResponseInit = {}
): NextResponse<T> {
  const response = NextResponse.json(body, init)
  response.headers.set('Access-Control-Allow-Origin', corsOrigin(request))
  response.headers.set('Access-Control-Allow-Methods', DEFAULT_METHODS)
  response.headers.set('Access-Control-Allow-Headers', DEFAULT_HEADERS)
  response.headers.set('Vary', 'Origin')
  return response
}

export function corsOptions(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set('Access-Control-Allow-Origin', corsOrigin(request))
  response.headers.set('Access-Control-Allow-Methods', DEFAULT_METHODS)
  response.headers.set('Access-Control-Allow-Headers', DEFAULT_HEADERS)
  response.headers.set('Vary', 'Origin')
  return response
}
