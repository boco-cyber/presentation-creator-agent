export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { loadPresentation } from '@/lib/storage'
import { generatePptx } from '@/lib/exporters/pptxExporter'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const buffer = await generatePptx(presentation)
  const filename = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.pptx`
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
