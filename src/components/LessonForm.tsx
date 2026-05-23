'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DESIGN_PROMPT_TEMPLATES } from '@/prompts/designPrompts'
import type { LessonFormData } from '@/types'

const TONE_OPTIONS = ['Professional', 'Conversational', 'Reverent', 'Energetic', 'Academic', 'Pastoral']
const SLIDE_COUNT_OPTIONS = [5, 7, 8, 10, 12, 15, 20]

export default function LessonForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/import', { method: 'POST', body: fd })
    if (res.ok) {
      const { text } = await res.json() as { text: string }
      setFormData(prev => ({ ...prev, lessonText: text }))
    }
    setImporting(false)
    // Reset the input so the same file can be re-imported if needed
    e.target.value = ''
  }

  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    lessonText: '',
    designPlot: 'clean corporate',
    audience: '',
    desiredSlideCount: 8,
    tone: 'Professional',
    outputStyle: 'presentation',
    speakerNotesPreference: 'full',
  })

  function update<K extends keyof LessonFormData>(key: K, value: LessonFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Please enter a presentation title.')
      return
    }
    if (!formData.lessonText.trim()) {
      setError('Please paste your lesson text.')
      return
    }
    if (formData.lessonText.trim().split(/\s+/).length < 20) {
      setError('Lesson text is too short. Please provide at least a few paragraphs.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json() as { error?: string }
        throw new Error(data.error ?? 'Failed to create presentation')
      }

      const data = await response.json() as { id: string }
      router.push(`/presentations/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const wordCount = formData.lessonText.trim()
    ? formData.lessonText.trim().split(/\s+/).length
    : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Section 1: Basic Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Presentation Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="title">
            Presentation Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. The Parable of the Talents"
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="audience">
              Audience
            </label>
            <input
              id="audience"
              type="text"
              value={formData.audience}
              onChange={(e) => update('audience', e.target.value)}
              placeholder="e.g. Sunday school youth, ages 13–17"
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="tone">
              Tone
            </label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => update('tone', e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="slideCount">
              Desired Slide Count
            </label>
            <select
              id="slideCount"
              value={formData.desiredSlideCount}
              onChange={(e) => update('desiredSlideCount', Number(e.target.value))}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {SLIDE_COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} slides</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Includes the title slide</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="speakerNotes">
              Speaker Notes
            </label>
            <select
              id="speakerNotes"
              value={formData.speakerNotesPreference}
              onChange={(e) =>
                update(
                  'speakerNotesPreference',
                  e.target.value as LessonFormData['speakerNotesPreference']
                )
              }
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="full">Full — complete section text</option>
              <option value="brief">Brief — first 300 characters</option>
              <option value="none">None</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Drawn from your lesson text only</p>
          </div>
        </div>
      </div>

      {/* Section 2: Lesson Text */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Your Lesson Text <span className="text-red-500">*</span>
          </h2>
          <span className="text-xs text-gray-500">{wordCount.toLocaleString()} words</span>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-xs text-blue-700">
            <strong>Paste your complete lesson here.</strong> The app will design it into slides —
            it will not add, change, or invent any content. Every bullet point and speaker note
            comes directly from what you write here.
          </p>
        </div>

        <div className="rounded-xl border-2 border-dashed border-gray-300 p-4 text-center hover:border-indigo-400 transition-colors">
          <label className="cursor-pointer">
            <input type="file" accept=".txt,.md,.docx,.pdf" onChange={handleFileImport} className="sr-only" />
            <div className="text-sm text-gray-600">
              {importing ? 'Importing...' : 'Import from file (.txt, .md, .docx, .pdf)'}
              <span className="block text-xs text-gray-400 mt-0.5">or paste your lesson below</span>
            </div>
          </label>
        </div>

        <textarea
          id="lessonText"
          value={formData.lessonText}
          onChange={(e) => update('lessonText', e.target.value)}
          rows={14}
          placeholder={`Paste your full lesson text here...

Example structure that works well:

Introduction:
This lesson covers...

Main Point 1: The Call
The first theme of the parable...

Main Point 2: The Response
The servants responded by...

Conclusion:
In summary...`}
          className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
          required
        />
        <p className="text-xs text-gray-500">
          Tip: Use headings (lines ending with a colon, or # Markdown headings, or ALL CAPS lines)
          to help the parser identify section breaks.
        </p>
      </div>

      {/* Section 3: Design Plot */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Design Style</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DESIGN_PROMPT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => update('designPlot', template.id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                formData.designPlot === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Color swatches */}
              <div className="flex gap-1 mb-2">
                {template.colorSwatch.map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-900">{template.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
              {formData.designPlot === template.id && (
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="customDesign">
            Or describe a custom design:
          </label>
          <input
            id="customDesign"
            type="text"
            value={formData.designPlot.startsWith('custom:') ? formData.designPlot : ''}
            onChange={(e) => {
              const val = e.target.value
              if (val) update('designPlot', `custom: ${val}`)
            }}
            placeholder='e.g. custom: warm earth tones with scripture verse footer'
            className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {formData.designPlot && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Selected design:</span> {formData.designPlot}
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-500">
          The app will split and format your lesson — it will not write new content.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Designing…' : 'Design My Slides'}
        </button>
      </div>
    </form>
  )
}
