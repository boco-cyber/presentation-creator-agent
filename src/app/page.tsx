import type { Metadata } from 'next'
import Link from 'next/link'
import { listPresentations } from '@/lib/storage'

export const metadata: Metadata = {
  title: 'Presentation Creator Agent — Lesson to Slides Designer',
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const recentPresentations = listPresentations().slice(0, 6)

  const features = [
    {
      title: 'You write the lesson',
      description:
        'Paste your complete lesson, sermon, or teaching notes. The app works entirely with your content.',
    },
    {
      title: 'We design the slides',
      description:
        'Rule-based parser splits your lesson into logical slides, applies a design style, and formats everything.',
    },
    {
      title: 'No content invented',
      description:
        'Every bullet point and speaker note is traceable to your source text. The app never writes teaching content.',
    },
    {
      title: 'Export immediately',
      description:
        'Download slides.json, outline.md, slides.md, and design-notes.md. PPTX export coming soon.',
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-6">
        <div className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700">
          Free &amp; Self-Hosted &mdash; No AI API required
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Lesson to Presentation
          <br />
          <span className="text-indigo-600">Designer</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-gray-600">
          You write the lesson. We design the slides.
        </p>
        <p className="mx-auto max-w-xl text-sm text-gray-500">
          Paste your teaching content and choose a design style. The app structures it into
          beautiful slide layouts — without inventing a single word of new content.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/new"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Create New Presentation
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 space-y-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-sm">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Styles */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Design Styles</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose a design style when creating your presentation
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Coptic Orthodox', colors: ['#8B0000', '#D4AF37', '#F5F0E8'] },
            { label: 'Youth Ministry', colors: ['#FF6B35', '#4ECDC4', '#FFE66D'] },
            { label: 'Modern Academic', colors: ['#1A2744', '#2563EB', '#FFFFFF'] },
            { label: 'Clean Corporate', colors: ['#18181B', '#71717A', '#F4F4F5'] },
            { label: 'Dark Theme', colors: ['#0F172A', '#38BDF8', '#818CF8'] },
            { label: 'Infographic', colors: ['#FF6B6B', '#4ECDC4', '#FFEAA7'] },
          ].map((style) => (
            <div
              key={style.label}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2"
            >
              <div className="flex gap-1">
                {style.colors.map((color, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">{style.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Presentations */}
      {recentPresentations.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Presentations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPresentations.map((p) => (
              <Link
                key={p.id}
                href={`/presentations/${p.id}`}
                className="rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {p.slideCount} slides
                  </span>
                </div>
                <p className="text-xs text-gray-500">{p.designPlot}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Safety notice */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-800">Design Only &mdash; Never Generates Content</p>
        <p className="text-xs text-amber-700 mt-1 max-w-xl mx-auto">
          This tool is a presentation designer, not a content generator. It will never write,
          expand, paraphrase, or invent teaching content. Every word in your slides comes from
          the lesson text you provide.
        </p>
      </section>
    </div>
  )
}
