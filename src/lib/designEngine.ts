/**
 * designEngine.ts
 *
 * Applies visual design metadata to slides based on the chosen design plot.
 *
 * CRITICAL RULE: This module NEVER modifies slide titles, bullets, or speaker notes.
 * It only adds: backgroundSuggestion, layoutSuggestion (refinement), visualDirection,
 * and designNotes. All textual content remains exactly as parsed from the source lesson.
 */

import type { Slide } from '@/types'

interface DesignStyle {
  name: string
  palette: string[]
  primaryFont: string
  accentFont: string
  backgroundBase: string
  accentColor: string
  borderStyle: string
  layoutNotes: string
  visualMotif: string
}

const DESIGN_STYLES: Record<string, DesignStyle> = {
  'coptic orthodox': {
    name: 'Coptic Orthodox',
    palette: ['#8B0000', '#C5A028', '#F5F0E8', '#2C1810', '#D4AF37'],
    primaryFont: 'EB Garamond, Georgia, serif',
    accentFont: 'Cinzel, Times New Roman, serif',
    backgroundBase: 'Warm parchment (#F5F0E8) with maroon (#8B0000) header band',
    accentColor: 'Gold (#D4AF37) and deep maroon (#8B0000)',
    borderStyle: 'Decorative icon-inspired border with Coptic cross motifs at corners',
    layoutNotes:
      'Centered titles with gold underline divider. Text in warm off-white panels. Footer with Coptic cross.',
    visualMotif:
      'Traditional Coptic iconography — golden borders, maroon drapery patterns, cross dividers',
  },
  'youth ministry': {
    name: 'Youth Ministry',
    palette: ['#FF6B35', '#4ECDC4', '#FFE66D', '#2ECC71', '#9B59B6'],
    primaryFont: 'Poppins, Nunito, sans-serif',
    accentFont: 'Fredoka One, Nunito Black, sans-serif',
    backgroundBase: 'Bright white with colorful gradient accent strips (coral to teal)',
    accentColor: 'Coral (#FF6B35) and teal (#4ECDC4) alternating per slide',
    borderStyle: 'Rounded rectangle cards with colored left-border accent',
    layoutNotes:
      'Large bold headings. Wide bullet spacing. Generous padding. High energy visual hierarchy.',
    visualMotif: 'Playful shapes, rounded elements, dynamic color blocks, energetic diagonals',
  },
  'modern academic': {
    name: 'Modern Academic',
    palette: ['#1A2744', '#FFFFFF', '#E8EDF5', '#2563EB', '#64748B'],
    primaryFont: 'Source Serif Pro, Georgia, serif',
    accentFont: 'Inter, Helvetica, sans-serif',
    backgroundBase: 'Clean white (#FFFFFF) with navy (#1A2744) header bar',
    accentColor: 'Navy (#1A2744) and academic blue (#2563EB)',
    borderStyle: 'Thin 1px navy bottom border on headings. Clean horizontal rules.',
    layoutNotes:
      'Table-friendly layouts. Clean column grids. Professional footnote space. Numbered slides.',
    visualMotif: 'University aesthetic — clean lines, academic whitespace, structured grid',
  },
  'clean corporate': {
    name: 'Clean Corporate',
    palette: ['#18181B', '#FFFFFF', '#F4F4F5', '#71717A', '#3F3F46'],
    primaryFont: 'Inter, Helvetica Neue, sans-serif',
    accentFont: 'Inter Medium, Helvetica Neue, sans-serif',
    backgroundBase: 'White (#FFFFFF) with light gray (#F4F4F5) content areas',
    accentColor: 'Charcoal (#18181B) and mid-gray (#71717A)',
    borderStyle: 'Hairline 0.5px dividers. No decorative borders. Minimal.',
    layoutNotes: 'Maximum white space. Left-aligned content. Thin typography. Business clean.',
    visualMotif: 'Minimal, executive — thin rules, tight spacing, monochrome palette',
  },
  'dark theme': {
    name: 'Dark Theme',
    palette: ['#0F172A', '#1E293B', '#F8FAFC', '#38BDF8', '#818CF8'],
    primaryFont: 'Inter, system-ui, sans-serif',
    accentFont: 'JetBrains Mono, Fira Code, monospace',
    backgroundBase: 'Deep dark navy (#0F172A) with subtle dark panel (#1E293B)',
    accentColor: 'Sky blue (#38BDF8) and lavender (#818CF8)',
    borderStyle: 'Glowing border effect: 1px solid rgba(56,189,248,0.4)',
    layoutNotes:
      'High contrast white text on dark. Accent color for headings. Code-friendly layouts.',
    visualMotif: 'Tech-forward dark UI — glows, gradients from dark to slightly lighter dark',
  },
  infographic: {
    name: 'Infographic',
    palette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    primaryFont: 'Nunito, Poppins, sans-serif',
    accentFont: 'Nunito Black, Impact, sans-serif',
    backgroundBase: 'White with color-coded section backgrounds per topic',
    accentColor: 'Data-driven: coral for problems, teal for solutions, yellow for insights',
    borderStyle: 'Icon slots at left with colored circle background. Number badges.',
    layoutNotes: 'Data panels, icon columns, visual hierarchy. Numbers prominent. Flow arrows.',
    visualMotif: 'Visual data storytelling — icons, numbered steps, color-coded categories',
  },
}

/**
 * Parse a "custom: [description]" design plot string and return a best-effort style.
 */
function parseCustomStyle(designPlot: string): DesignStyle {
  const description = designPlot.replace(/^custom:\s*/i, '').toLowerCase()

  // Detect keywords and map to closest built-in style
  if (description.includes('dark') || description.includes('night')) {
    return { ...DESIGN_STYLES['dark theme'], name: `Custom (Dark): ${description}` }
  }
  if (description.includes('church') || description.includes('orthodox') || description.includes('coptic')) {
    return { ...DESIGN_STYLES['coptic orthodox'], name: `Custom (Church): ${description}` }
  }
  if (
    description.includes('youth') ||
    description.includes('fun') ||
    description.includes('bright')
  ) {
    return { ...DESIGN_STYLES['youth ministry'], name: `Custom (Youth): ${description}` }
  }
  if (
    description.includes('academic') ||
    description.includes('school') ||
    description.includes('university')
  ) {
    return { ...DESIGN_STYLES['modern academic'], name: `Custom (Academic): ${description}` }
  }
  if (description.includes('data') || description.includes('chart') || description.includes('visual')) {
    return { ...DESIGN_STYLES['infographic'], name: `Custom (Infographic): ${description}` }
  }

  // Default fallback — clean corporate
  return {
    ...DESIGN_STYLES['clean corporate'],
    name: `Custom: ${description}`,
    layoutNotes: `Custom style requested: "${description}". Applied clean corporate base. Adjust colors to match your custom description.`,
  }
}

/**
 * Resolve the design style from a designPlot string.
 */
function resolveStyle(designPlot: string): DesignStyle {
  const normalized = designPlot.toLowerCase().trim()

  for (const [key, style] of Object.entries(DESIGN_STYLES)) {
    if (normalized.includes(key)) return style
  }

  if (normalized.startsWith('custom:')) {
    return parseCustomStyle(designPlot)
  }

  // Unknown — use clean corporate
  return DESIGN_STYLES['clean corporate']
}

/**
 * Determine layout suggestion based on content density.
 */
function suggestLayout(slide: Slide, slideIndex: number): string {
  if (slideIndex === 0) return 'title-centered'
  if (slide.mainBullets.length === 0) return 'text-only'
  if (slide.mainBullets.length <= 2) return 'two-column-left-text'
  if (slide.mainBullets.length >= 5) return 'compact-bullet-list'
  return 'standard-bullet-list'
}

/**
 * Apply design metadata to all slides. Does NOT modify text content.
 *
 * @param slides - Slides from lessonParser (titles/bullets/notes already set)
 * @param designPlot - The user's chosen design style string
 * @returns The same slides array with design fields populated
 */
export function applyDesign(slides: Slide[], designPlot: string): Slide[] {
  const style = resolveStyle(designPlot)

  return slides.map((slide, index) => {
    const isTitleSlide = index === 0
    const layout = suggestLayout(slide, index)

    let background: string
    let visualDirection: string
    let designNotes: string

    if (isTitleSlide) {
      background = `Full-bleed: ${style.backgroundBase}. Centered title in ${style.accentFont}. Subtitle in ${style.primaryFont}.`
      visualDirection = `${style.visualMotif}. Title slide: large centered title, subtitle line, decorative bottom element.`
      designNotes = [
        `Font: ${style.accentFont} for title`,
        `Color: ${style.accentColor}`,
        `Background: ${style.backgroundBase}`,
        `Border: ${style.borderStyle}`,
        `Style: ${style.name}`,
      ].join(' | ')
    } else {
      background = `${style.backgroundBase}. Header band with slide title.`
      visualDirection = `${style.visualMotif}. ${layout.replace(/-/g, ' ')} layout. Bullet items from source text only.`
      designNotes = [
        `Font: ${style.primaryFont}`,
        `Accent: ${style.accentColor}`,
        `Layout: ${layout}`,
        `Border: ${style.borderStyle}`,
        `Palette: ${style.palette.slice(0, 3).join(', ')}`,
      ].join(' | ')
    }

    return {
      ...slide,
      backgroundSuggestion: background,
      layoutSuggestion: layout,
      visualDirection,
      designNotes,
    }
  })
}

/**
 * Get all available built-in design style names.
 */
export function getAvailableStyles(): string[] {
  return Object.keys(DESIGN_STYLES)
}

/**
 * Get design style details for display in UI.
 */
export function getStyleDetails(
  designPlot: string
): Pick<DesignStyle, 'name' | 'palette' | 'backgroundBase' | 'accentColor'> {
  const style = resolveStyle(designPlot)
  return {
    name: style.name,
    palette: style.palette,
    backgroundBase: style.backgroundBase,
    accentColor: style.accentColor,
  }
}
