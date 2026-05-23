import type { Slide, LessonFormData, Infographic } from '@/types'
import { callAI, loadSettings } from './aiProvider'

const SYSTEM_PROMPT = `You are a presentation design expert. Transform the user's lesson into structured slides.

CRITICAL RULES (never break these):
- Every bullet point, title, and speaker note must come DIRECTLY from the user's lesson text
- Never invent, add, or expand content not present in the source lesson
- Speaker notes = the original lesson text for that section, verbatim or condensed — never invented
- Bullets = extracted from source, never created from scratch

For each slide, choose the best infographic type:
- "bullets" = standard list (default for most content)
- "timeline" = sequential events/dates/steps
- "process" = step-by-step procedure or method
- "stats" = key numbers, percentages, counts from the lesson
- "comparison" = two sides being contrasted
- "quote" = a key statement or important declaration
- "icon-grid" = a set of categorized items (use relevant emojis as icons)
- "title" = cover slide only

Return ONLY a valid JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "slideNumber": 1,
    "type": "title",
    "title": "string",
    "subtitle": "string or empty",
    "mainBullets": [],
    "sourceExcerpt": "string",
    "speakerNotes": "string",
    "infographic": null
  },
  {
    "slideNumber": 2,
    "type": "bullets|timeline|process|stats|comparison|quote|icon-grid",
    "title": "string (compelling title from source content)",
    "subtitle": "",
    "mainBullets": ["bullet1", "bullet2"],
    "sourceExcerpt": "original text this slide came from",
    "speakerNotes": "from source text only",
    "infographic": {
      "type": "timeline",
      "items": [{"step": "1", "label": "Event", "detail": "detail from lesson"}]
    }
  }
]

For comparison type: infographic.comparison = {"left": {"header": "...", "points": [...]}, "right": {"header": "...", "points": [...]}}
For quote type: infographic.quote = {"quote": "...", "attribution": "optional"}
For stats type: infographic.items = [{"value": "40", "label": "Days", "context": "context from lesson"}]
For icon-grid type: infographic.items = [{"icon": "✝️", "label": "Faith", "description": "from lesson"}]`

export async function processLessonWithAI(formData: LessonFormData): Promise<Slide[]> {
  const settings = loadSettings()
  const config = settings.aiProvider

  if (config.provider === 'none') {
    throw new Error('no-ai') // caller falls back to rule-based parser
  }

  const userMessage = `Create a ${formData.desiredSlideCount}-slide presentation from this lesson.

Title: ${formData.title}
Audience: ${formData.audience}
Tone: ${formData.tone}
Design Style: ${formData.designPlot}
Speaker Notes Preference: ${formData.speakerNotesPreference}

LESSON TEXT (use ONLY this content):
---
${formData.lessonText}
---

Return exactly ${formData.desiredSlideCount} slides as a JSON array.`

  const raw = await callAI(config, SYSTEM_PROMPT, userMessage)

  // Extract JSON from response (handle models that wrap in markdown)
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('AI returned invalid JSON')

  const parsed = JSON.parse(jsonMatch[0]) as Array<{
    slideNumber: number
    type: string
    title: string
    subtitle?: string
    mainBullets: string[]
    sourceExcerpt: string
    speakerNotes: string
    infographic: Infographic | null
  }>

  return parsed.map((s, idx) => ({
    slideNumber: s.slideNumber || idx + 1,
    title: s.title || '',
    subtitle: s.subtitle || '',
    mainBullets: s.mainBullets || [],
    sourceExcerpt: s.sourceExcerpt || '',
    speakerNotes: formData.speakerNotesPreference === 'none' ? '' : (s.speakerNotes || ''),
    backgroundSuggestion: '',
    layoutSuggestion: s.type || 'bullets',
    visualDirection: s.type || 'bullets',
    designNotes: '',
    infographic: s.infographic || undefined,
  }))
}
