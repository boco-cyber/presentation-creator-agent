import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadPresentation } from '@/lib/storage'
import SlideCard from '@/components/SlideCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) return { title: 'Presentation Not Found' }
  return { title: `Slides: ${presentation.title}` }
}

export default async function SlidesPage({ params }: PageProps) {
  const { id } = await params
  const presentation = loadPresentation(id)

  if (!presentation) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb + Title */}
      <div>
        <nav className="text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-1">/</span>
          <Link href={`/presentations/${id}`} className="hover:text-gray-700">
            Outline
          </Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">Slides</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{presentation.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {presentation.slideCount} slides &middot; {presentation.designPlot}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/presentations/${id}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Outline
            </Link>
            <Link
              href={`/presentations/${id}/export`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Export
            </Link>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <p className="text-xs text-blue-700">
          All slide content shown below comes from your lesson text. Speaker notes are
          excerpts from your source — nothing has been invented or paraphrased.
        </p>
      </div>

      {/* Slide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {presentation.slides.map((slide) => (
          <SlideCard
            key={slide.slideNumber}
            slide={slide}
            showDesignNotes={true}
            showSpeakerNotes={true}
          />
        ))}
      </div>
    </div>
  )
}
