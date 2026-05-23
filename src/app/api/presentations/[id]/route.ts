/**
 * GET /api/presentations/[id]
 *
 * Returns a saved presentation by ID.
 */

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { loadPresentation } from '@/lib/storage'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Presentation ID is required' }, { status: 400 })
    }

    const presentation = loadPresentation(id)

    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
    }

    return NextResponse.json(presentation)
  } catch (error) {
    console.error('[GET /api/presentations/[id]] Error:', error)
    return NextResponse.json({ error: 'Failed to load presentation' }, { status: 500 })
  }
}
