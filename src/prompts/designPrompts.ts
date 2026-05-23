/**
 * designPrompts.ts
 *
 * Design style template strings for UI display and future AI integration.
 * These describe visual direction only — never lesson content.
 */

export interface DesignPromptTemplate {
  id: string
  label: string
  description: string
  colorSwatch: string[]
  example: string
}

export const DESIGN_PROMPT_TEMPLATES: DesignPromptTemplate[] = [
  {
    id: 'coptic orthodox',
    label: 'Coptic Orthodox',
    description:
      'Warm maroon, gold, and green palette with joyful Coptic accents, soft parchment backgrounds, and celebratory serif typography.',
    colorSwatch: ['#6A1B1B', '#E8B94A', '#FFF7E8', '#3E8E5A'],
    example:
      'Gold title on parchment background, maroon header band, joyful green accents, and Coptic cross framing',
  },
  {
    id: 'youth ministry',
    label: 'Youth Ministry',
    description:
      'Bright energetic colors, rounded elements, modern sans-serif fonts. High energy and engaging.',
    colorSwatch: ['#FF6B35', '#4ECDC4', '#FFE66D'],
    example: 'Coral gradient header, rounded bullet cards, bold colorful typography',
  },
  {
    id: 'modern academic',
    label: 'Modern Academic',
    description:
      'Clean white with navy accents. Professional and structured. Table-friendly layouts with clear hierarchy.',
    colorSwatch: ['#1A2744', '#2563EB', '#FFFFFF'],
    example: 'Navy header bar, white content area, academic blue accent lines',
  },
  {
    id: 'clean corporate',
    label: 'Clean Corporate',
    description:
      'Minimal white and gray. Thin lines. Business professional. Maximum whitespace.',
    colorSwatch: ['#18181B', '#71717A', '#F4F4F5'],
    example: 'All-white slide, hairline dividers, charcoal text, left-aligned content',
  },
  {
    id: 'dark theme',
    label: 'Dark Theme',
    description:
      'Dark navy background with light text and sky blue or lavender accents. High contrast and modern.',
    colorSwatch: ['#0F172A', '#38BDF8', '#818CF8'],
    example: 'Dark navy background, sky blue headings, white body text, glowing border',
  },
  {
    id: 'infographic',
    label: 'Infographic',
    description:
      'Data-friendly layouts with icon slots, numbered steps, and color-coded categories. Visual hierarchy.',
    colorSwatch: ['#FF6B6B', '#4ECDC4', '#FFEAA7'],
    example: 'Numbered circle icons, color-banded sections, visual flow arrows',
  },
]

/**
 * Get the design template for a given design plot string.
 */
export function getDesignTemplate(designPlot: string): DesignPromptTemplate | undefined {
  const normalized = designPlot.toLowerCase().trim()
  return DESIGN_PROMPT_TEMPLATES.find((t) => normalized.includes(t.id))
}

/**
 * Get all design template IDs.
 */
export function getAllDesignIds(): string[] {
  return DESIGN_PROMPT_TEMPLATES.map((t) => t.id)
}
