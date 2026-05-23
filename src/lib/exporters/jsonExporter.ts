/**
 * jsonExporter.ts
 *
 * Generates the slides.json export file from a Presentation object.
 */

import type { Presentation } from '@/types'

/**
 * Generate slides.json string — the canonical presentation data format.
 */
export function generateSlidesJson(presentation: Presentation): string {
  const exportData = {
    title: presentation.title,
    sourceLessonPreserved: true as const,
    audience: presentation.audience,
    tone: presentation.tone,
    designPlot: presentation.designPlot,
    slideCount: presentation.slideCount,
    createdAt: presentation.createdAt,
    slides: presentation.slides.map((slide) => ({
      slideNumber: slide.slideNumber,
      title: slide.title,
      mainBullets: slide.mainBullets,
      sourceExcerpt: slide.sourceExcerpt,
      speakerNotes: slide.speakerNotes,
      backgroundSuggestion: slide.backgroundSuggestion,
      layoutSuggestion: slide.layoutSuggestion,
      visualDirection: slide.visualDirection,
      designNotes: slide.designNotes,
    })),
  }

  return JSON.stringify(exportData, null, 2)
}
