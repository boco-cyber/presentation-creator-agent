import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPresentation } from '@/lib/storage'
import OutlinePreview from '@/components/OutlinePreview'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) return { title: 'Presentation Not Found' }
  return { title: `Outline: ${presentation.title}` }
}

export default async function OutlinePage({ params }: PageProps) {
  const { id } = await params
  const presentation = loadPresentation(id)

  if (!presentation) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Outline</span>
      </nav>

      {/* Meta card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{presentation.title}</h1>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <dt className="text-xs font-medium text-gray-500">Slides</dt>
            <dd className="text-lg font-semibold text-gray-900 mt-0.5">{presentation.slideCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Audience</dt>
            <dd className="text-sm text-gray-700 mt-0.5">{presentation.audience || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Tone</dt>
            <dd className="text-sm text-gray-700 mt-0.5">{presentation.tone || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Created</dt>
            <dd className="text-sm text-gray-700 mt-0.5">
              {new Date(presentation.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <dt className="text-xs font-medium text-gray-500 mb-1">Design Style</dt>
          <dd className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {presentation.designPlot}
          </dd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/presentations/${id}/slides`}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          View Slide Cards
        </Link>
        <Link
          href={`/presentations/${id}/export`}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Export Files
        </Link>
      </div>

      {/* Outline */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Slide Outline ({presentation.slideCount} slides)
        </h2>
        <OutlinePreview presentation={presentation} />
      </div>
    </div>
  )
}
