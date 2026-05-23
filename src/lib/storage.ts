/**
 * storage.ts
 *
 * Local file-based storage for presentations.
 * All presentations are stored under /presentations/[id]/ at project root.
 */

import fs from 'fs'
import path from 'path'
import type { Presentation, PresentationListItem } from '@/types'

// Root presentations directory (project root /presentations/)
const PRESENTATIONS_DIR = path.join(process.cwd(), 'presentations')

/**
 * Ensure the presentations directory and a specific presentation subdirectory exist.
 */
function ensureDir(presentationId: string): string {
  const dir = path.join(PRESENTATIONS_DIR, presentationId)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

/**
 * Save all presentation files to disk.
 */
export function savePresentation(
  presentation: Presentation,
  files: {
    slidesJson: string
    outlineMd: string
    slidesMd: string
    designNotesMd: string
  }
): void {
  const dir = ensureDir(presentation.id)

  fs.writeFileSync(path.join(dir, 'slides.json'), files.slidesJson, 'utf-8')
  fs.writeFileSync(path.join(dir, 'outline.md'), files.outlineMd, 'utf-8')
  fs.writeFileSync(path.join(dir, 'slides.md'), files.slidesMd, 'utf-8')
  fs.writeFileSync(path.join(dir, 'design-notes.md'), files.designNotesMd, 'utf-8')
}

/**
 * Load a presentation from disk by ID.
 * Returns null if not found.
 */
export function loadPresentation(id: string): Presentation | null {
  const filePath = path.join(PRESENTATIONS_DIR, id, 'slides.json')
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as Presentation
  } catch {
    return null
  }
}

/**
 * List all saved presentations (most recent first).
 */
export function listPresentations(): PresentationListItem[] {
  if (!fs.existsSync(PRESENTATIONS_DIR)) return []

  const entries = fs.readdirSync(PRESENTATIONS_DIR, { withFileTypes: true })
  const items: PresentationListItem[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const jsonPath = path.join(PRESENTATIONS_DIR, entry.name, 'slides.json')
    if (!fs.existsSync(jsonPath)) continue

    try {
      const raw = fs.readFileSync(jsonPath, 'utf-8')
      const p = JSON.parse(raw) as Presentation
      items.push({
        id: p.id,
        title: p.title,
        slideCount: p.slideCount,
        createdAt: p.createdAt,
        designPlot: p.designPlot,
      })
    } catch {
      // Skip corrupt files
    }
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * Read a raw export file (outline.md, slides.md, design-notes.md) for a presentation.
 */
export function readExportFile(
  id: string,
  filename: 'outline.md' | 'slides.md' | 'design-notes.md' | 'slides.json'
): string | null {
  const filePath = path.join(PRESENTATIONS_DIR, id, filename)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf-8')
}
