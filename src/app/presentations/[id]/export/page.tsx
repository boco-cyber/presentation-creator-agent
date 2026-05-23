import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPresentation, readExportFile } from '@/lib/storage'
import ExportPanel from '@/components/ExportPanel'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) return { title: 'Presentation Not Found' }
  return { title: `Export: ${presentation.title}` }
}

export default async function ExportPage({ params }: PageProps) {
  const { id } = await params
  const presentation = loadPresentation(id)

  if (!presentation) {
    notFound()
  }

  const slidesJsonContent = readExportFile(id, 'slides.json') ?? ''
  const outlineMdContent = readExportFile(id, 'outline.md') ?? ''
  const slidesMdContent = readExportFile(id, 'slides.md') ?? ''
  const designNotesMdContent = readExportFile(id, 'design-notes.md') ?? ''

  const exportFiles = [
    {
      filename: 'slides.json',
      label: 'Slides JSON',
      description: 'Complete structured data with all slide content and design metadata.',
      content: slidesJsonContent,
      mimeType: 'application/json',
    },
    {
      filename: 'outline.md',
      label: 'Outline Markdown',
      description: 'Clean slide-by-slide outline with titles and bullet points.',
      content: outlineMdContent,
      mimeType: 'text/markdown',
    },
    {
      filename: 'slides.md',
      label: 'Slides Markdown',
      description: 'Each slide as a fenced section with speaker notes and design hints.',
      content: slidesMdContent,
      mimeType: 'text/markdown',
    },
    {
      filename: 'design-notes.md',
      label: 'Design Notes',
      description:
        'Per-slide design specifications: backgrounds, layouts, visual direction, typography.',
      content: designNotesMdContent,
      mimeType: 'text/markdown',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-1">/</span>
        <Link href={`/presentations/${id}`} className="hover:text-gray-700">
          Outline
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Export</span>
      </nav>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Export: {presentation.title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {presentation.slideCount} slides &middot; {presentation.designPlot}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/presentations/${id}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Outline
        </Link>
        <Link
          href={`/presentations/${id}/slides`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Slides
        </Link>
      </div>

      <ExportPanel presentationId={id} files={exportFiles} />
    </div>
  )
}
