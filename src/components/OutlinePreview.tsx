'use client'

import { useState } from 'react'
import type { Presentation } from '@/types'

interface OutlinePreviewProps {
  presentation: Presentation
}

export default function OutlinePreview({ presentation }: OutlinePreviewProps) {
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null)

  function toggleSlide(slideNumber: number) {
    setExpandedSlide((prev) => (prev === slideNumber ? null : slideNumber))
  }

  return (
    <div className="space-y-2">
      {presentation.slides.map((slide) => {
        const isExpanded = expandedSlide === slide.slideNumber
        const isTitleSlide = slide.slideNumber === 1

        return (
          <div
            key={slide.slideNumber}
            className={`rounded-lg border transition-colors ${
              isTitleSlide ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSlide(slide.slideNumber)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isTitleSlide
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {slide.slideNumber}
                </span>
                <span
                  className={`text-sm font-medium truncate ${
                    isTitleSlide ? 'text-indigo-900' : 'text-gray-900'
                  }`}
                >
                  {slide.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {slide.mainBullets.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {slide.mainBullets.length} bullet{slide.mainBullets.length !== 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                {slide.mainBullets.length > 0 ? (
                  <ul className="space-y-1.5">
                    {slide.mainBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">Title slide — no content bullets</p>
                )}

                {slide.layoutSuggestion && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Layout:</span> {slide.layoutSuggestion}
                  </p>
                )}

                {slide.speakerNotes && (
                  <div className="rounded-md bg-amber-50 px-3 py-2">
                    <p className="text-xs font-medium text-amber-700 mb-1">Speaker Notes</p>
                    <p className="text-xs text-amber-800 line-clamp-3">{slide.speakerNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
