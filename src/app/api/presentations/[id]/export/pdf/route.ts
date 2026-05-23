export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { loadPresentation } from '@/lib/storage'

// Returns slide data for client-side PDF generation
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(presentation)
}
