/**
 * lessonParser.ts
 *
 * Core rule-based lesson parser. Splits the user's lesson text into slides.
 *
 * CRITICAL RULE: This module NEVER invents content. Every word in the output
 * must be traceable to the user's source lesson text. Speaker notes are
 * excerpts from the source — never paraphrased or invented.
 */

import type { Slide, LessonFormData } from '@/types'

/**
 * Detect whether a line qualifies as a section heading.
 */
function isHeading(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false

  // Markdown headings: # Heading or ## Heading
  if (/^#{1,4}\s+.+/.test(trimmed)) return true

  // ALL CAPS line (3+ chars, no lowercase)
  if (trimmed.length >= 3 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return true

  // Short line ending with colon (likely a section label), max 60 chars
  if (trimmed.endsWith(':') && trimmed.length <= 60 && !trimmed.includes('.')) return true

  return false
}

/**
 * Strip markdown heading markers from a heading line.
 */
function cleanHeading(line: string): string {
  return line
    .trim()
    .replace(/^#{1,4}\s+/, '')
    .replace(/:$/, '')
    .trim()
}

/**
 * Extract the first sentence or first N words from a block of text.
 * Used to auto-generate a slide title from a paragraph without a heading.
 */
function extractTitle(text: string, maxWords = 8): string {
  const firstSentence = text.split(/[.!?]/)[0].trim()
  const words = firstSentence.split(/\s+/).slice(0, maxWords)
  return words.join(' ')
}

/**
 * Convert a block of text into at most `max` bullet points.
 * Each bullet is at most `maxWords` words.
 * Bullets are drawn from existing sentence-level content only.
 */
function textToBullets(text: string, max = 5, maxWords = 10): string[] {
  // Split on sentence boundaries or existing bullet markers
  const raw = text
    .split(/(?:\n[-*•]|\.\s+|\n\n)/)
    .map((s) => s.replace(/^[-*•]\s*/, '').trim())
    .filter((s) => s.length > 3)

  return raw.slice(0, max).map((sentence) => {
    const words = sentence.split(/\s+/)
    if (words.length <= maxWords) return sentence
    return words.slice(0, maxWords).join(' ') + '…'
  })
}

/**
 * Extract a short excerpt from a text block (first 200 chars).
 */
function extractExcerpt(text: string): string {
  const clean = text.replace(/\n+/g, ' ').trim()
  if (clean.length <= 200) return clean
  return clean.slice(0, 197) + '…'
}

/**
 * Build speaker notes from source text according to user preference.
 * NEVER invents content — only uses source text.
 */
function buildSpeakerNotes(
  text: string,
  preference: LessonFormData['speakerNotesPreference']
): string {
  if (preference === 'none') return ''
  const clean = text.replace(/\n+/g, ' ').trim()
  if (preference === 'brief') {
    // First 300 chars of source
    return clean.length <= 300 ? clean : clean.slice(0, 297) + '…'
  }
  // 'full' — full source text for this section
  return clean
}

interface Section {
  heading: string
  body: string
}

/**
 * Split lesson text into logical sections.
 */
function splitIntoSections(lessonText: string): Section[] {
  const lines = lessonText.split('\n')
  const sections: Section[] = []

  let currentHeading = ''
  let currentBody: string[] = []

  for (const line of lines) {
    if (isHeading(line)) {
      // Save previous section
      if (currentBody.join('').trim()) {
        sections.push({
          heading: currentHeading,
          body: currentBody.join('\n').trim(),
        })
      }
      currentHeading = cleanHeading(line)
      currentBody = []
    } else {
      currentBody.push(line)
    }
  }

  // Push last section
  if (currentBody.join('').trim()) {
    sections.push({
      heading: currentHeading,
      body: currentBody.join('\n').trim(),
    })
  }

  // If no headings were found at all, treat every 2-3 paragraphs as a section
  if (sections.length === 0) {
    const paragraphs = lessonText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    for (const para of paragraphs) {
      sections.push({
        heading: '',
        body: para,
      })
    }
  }

  return sections
}

/**
 * Merge or split sections to hit the desired slide count (excluding title slide).
 */
function normalizeSections(sections: Section[], targetCount: number): Section[] {
  const contentSlides = targetCount - 1 // subtract title slide
  if (contentSlides <= 0) return sections.slice(0, 1)

  if (sections.length === contentSlides) return sections

  // Too many sections — merge adjacent ones
  if (sections.length > contentSlides) {
    const merged: Section[] = []
    const mergeRatio = sections.length / contentSlides

    for (let i = 0; i < contentSlides; i++) {
      const start = Math.round(i * mergeRatio)
      const end = Math.round((i + 1) * mergeRatio)
      const chunk = sections.slice(start, end)

      merged.push({
        heading: chunk[0].heading || extractTitle(chunk[0].body),
        body: chunk.map((s) => (s.heading ? `${s.heading}:\n${s.body}` : s.body)).join('\n\n'),
      })
    }
    return merged
  }

  // Too few sections — split large ones by paragraphs
  let result = [...sections]
  while (result.length < contentSlides) {
    // Find the largest section
    const largest = result.reduce(
      (maxIdx, s, idx) => (s.body.length > result[maxIdx].body.length ? idx : maxIdx),
      0
    )
    const toSplit = result[largest]
    const paragraphs = toSplit.body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    if (paragraphs.length < 2) break // Cannot split further

    const half = Math.ceil(paragraphs.length / 2)
    const partA: Section = {
      heading: toSplit.heading,
      body: paragraphs.slice(0, half).join('\n\n'),
    }
    const partB: Section = {
      heading: extractTitle(paragraphs[half]),
      body: paragraphs.slice(half).join('\n\n'),
    }

    result.splice(largest, 1, partA, partB)
  }

  return result.slice(0, contentSlides)
}

/**
 * Main export: parse a lesson into an array of Slide objects.
 *
 * @param formData - The complete lesson form submission
 * @returns Array of Slide objects — all content sourced from formData.lessonText
 */
export function parseLesson(formData: LessonFormData): Slide[] {
  const slides: Slide[] = []
  const { lessonText, title, desiredSlideCount, speakerNotesPreference } = formData

  // Slide 1: Title slide
  const titleSlide: Slide = {
    slideNumber: 1,
    title: title,
    mainBullets: [],
    sourceExcerpt: lessonText.slice(0, 100).replace(/\n/g, ' ').trim() + '…',
    speakerNotes:
      speakerNotesPreference !== 'none'
        ? `This presentation is based on the lesson: "${title}". Audience: ${formData.audience}.`
        : '',
    backgroundSuggestion: '',
    layoutSuggestion: 'title-centered',
    visualDirection: '',
    designNotes: '',
  }
  slides.push(titleSlide)

  // Parse lesson into sections
  const rawSections = splitIntoSections(lessonText)
  const normalizedSections = normalizeSections(rawSections, desiredSlideCount)

  // Convert each section into a slide
  for (let i = 0; i < normalizedSections.length; i++) {
    const section = normalizedSections[i]
    const slideNumber = i + 2

    const slideTitle = section.heading || extractTitle(section.body)
    const bullets = textToBullets(section.body)
    const sourceExcerpt = extractExcerpt(section.body)
    const speakerNotes = buildSpeakerNotes(section.body, speakerNotesPreference)

    const slide: Slide = {
      slideNumber,
      title: slideTitle,
      mainBullets: bullets,
      sourceExcerpt,
      speakerNotes,
      backgroundSuggestion: '',
      layoutSuggestion: bullets.length <= 2 ? 'two-column' : 'bullet-list',
      visualDirection: '',
      designNotes: '',
    }

    slides.push(slide)
  }

  return slides
}
