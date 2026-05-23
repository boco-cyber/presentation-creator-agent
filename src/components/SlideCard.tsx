import type { Slide } from '@/types'
import InfographicRenderer from './InfographicRenderer'

interface SlideCardProps {
  slide: Slide
  showDesignNotes?: boolean
  showSpeakerNotes?: boolean
}

export default function SlideCard({
  slide,
  showDesignNotes = false,
  showSpeakerNotes = true,
}: SlideCardProps) {
  const isTitleSlide = slide.slideNumber === 1

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Slide Header */}
      <div
        className={`px-5 py-4 ${
          isTitleSlide
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-50 border-b border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isTitleSlide
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {slide.slideNumber}
            </span>
            <h3
              className={`font-semibold text-base leading-snug truncate ${
                isTitleSlide ? 'text-white' : 'text-gray-900'
              }`}
              title={slide.title}
            >
              {slide.title}
            </h3>
          </div>
          {isTitleSlide && (
            <span className="flex-shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white font-medium">
              Title Slide
            </span>
          )}
        </div>
      </div>

      {/* Slide Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Infographic or Bullets */}
        {slide.infographic ? (
          <InfographicRenderer infographic={slide.infographic} />
        ) : slide.mainBullets.length > 0 ? (
          <ul className="space-y-2">
            {slide.mainBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          !isTitleSlide && (
            <p className="text-sm text-gray-400 italic">Layout only slide</p>
          )
        )}

        {isTitleSlide && (
          <p className="text-sm text-gray-500 italic">
            Title slide — centered layout with presentation title
          </p>
        )}

        {/* Layout Badge */}
        <div className="flex flex-wrap gap-2">
          {slide.layoutSuggestion && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              Layout: {slide.layoutSuggestion}
            </span>
          )}
        </div>

        {/* Speaker Notes */}
        {showSpeakerNotes && slide.speakerNotes && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">Speaker Notes</p>
            <p className="text-xs text-amber-800 leading-relaxed">{slide.speakerNotes}</p>
          </div>
        )}

        {/* Design Notes */}
        {showDesignNotes && slide.designNotes && (
          <div className="rounded-lg bg-purple-50 border border-purple-100 px-4 py-3">
            <p className="text-xs font-semibold text-purple-700 mb-1">Design Notes</p>
            <p className="text-xs text-purple-800 leading-relaxed">{slide.designNotes}</p>
            {slide.backgroundSuggestion && (
              <p className="text-xs text-purple-700 mt-2">
                <span className="font-medium">Background:</span> {slide.backgroundSuggestion}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
