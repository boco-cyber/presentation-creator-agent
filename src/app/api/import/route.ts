export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    let text = ''

    if (ext === 'txt' || ext === 'md') {
      text = buffer.toString('utf-8')
    } else if (ext === 'docx') {
      const mammoth = (await import('mammoth')).default
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (ext === 'pdf') {
      const { PDFParse } = (await import('pdf-parse')) as {
        PDFParse: new (opts: { data: Uint8Array }) => {
          getText: () => Promise<{ text: string }>
        }
      }
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      text = result.text
    } else {
      return NextResponse.json({ error: `Unsupported file type: .${ext}` }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim(), filename: file.name })
  } catch (err) {
    console.error('[import] Error:', err)
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 })
  }
}
