import PptxGenJS from 'pptxgenjs'
import type { Presentation, Slide } from '@/types'

// Design theme palettes
const THEMES: Record<string, { bg: string; titleBg: string; titleFg: string; accent: string; bodyFg: string }> = {
  'coptic orthodox': { bg: 'FFF7E8', titleBg: '6A1B1B', titleFg: 'FFF7E8', accent: 'E8B94A', bodyFg: '2F1C16' },
  'youth ministry': { bg: 'FFFFFF', titleBg: 'FF6B6B', titleFg: 'FFFFFF', accent: 'FFD93D', bodyFg: '2D3436' },
  'modern academic': { bg: 'FFFFFF', titleBg: '1B3A6B', titleFg: 'FFFFFF', accent: '2196F3', bodyFg: '212121' },
  'clean corporate': { bg: 'FAFAFA', titleBg: '2C3E50', titleFg: 'FFFFFF', accent: '3498DB', bodyFg: '333333' },
  'dark theme': { bg: '1E1E2E', titleBg: '313142', titleFg: 'CDD6F4', accent: '89B4FA', bodyFg: 'CDD6F4' },
  'infographic': { bg: 'FFFFFF', titleBg: '6C3FC0', titleFg: 'FFFFFF', accent: 'FF6B6B', bodyFg: '222222' },
}

function getTheme(designPlot: string) {
  const key = designPlot.toLowerCase()
  for (const [k, v] of Object.entries(THEMES)) {
    if (key.includes(k)) return v
  }
  return THEMES['clean corporate']
}

type Theme = ReturnType<typeof getTheme>
type PptxSlide = ReturnType<PptxGenJS['addSlide']>

export async function generatePptx(presentation: Presentation): Promise<Buffer> {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.title = presentation.title

  const theme = getTheme(presentation.designPlot)

  for (const slide of presentation.slides) {
    const pSlide = pptx.addSlide()

    // Background
    pSlide.background = { color: theme.bg }

    const isTitleSlide = slide.slideNumber === 1 || slide.layoutSuggestion === 'title'

    if (isTitleSlide) {
      // Full-screen color background
      pSlide.background = { color: theme.titleBg }
      // Title
      pSlide.addText(slide.title, {
        x: 0.5, y: 2.0, w: 12.3, h: 1.5,
        fontSize: 40, bold: true, color: theme.titleFg,
        align: 'center', fontFace: 'Calibri',
      })
      // Subtitle
      if (slide.subtitle) {
        pSlide.addText(slide.subtitle, {
          x: 0.5, y: 3.7, w: 12.3, h: 0.8,
          fontSize: 22, color: theme.accent,
          align: 'center', fontFace: 'Calibri',
        })
      }
      // Accent line
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 5.0, y: 4.7, w: 3.3, h: 0.05,
        fill: { color: theme.accent }, line: { type: 'none' },
      })
    } else if (slide.infographic) {
      addInfographicSlide(pptx, pSlide, slide, theme)
    } else {
      // Standard bullets slide
      addTitleBar(pptx, pSlide, slide.title, theme)
      addBullets(pSlide, slide.mainBullets, theme)
    }

    // Speaker notes
    if (slide.speakerNotes) {
      pSlide.addNotes(slide.speakerNotes)
    }
  }

  const result = await pptx.stream()
  return Buffer.from(result as ArrayBuffer)
}

function addTitleBar(pptx: PptxGenJS, slide: PptxSlide, title: string, theme: Theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 1.2,
    fill: { color: theme.titleBg }, line: { type: 'none' },
  })
  slide.addText(title, {
    x: 0.4, y: 0.1, w: 12.5, h: 1.0,
    fontSize: 26, bold: true, color: theme.titleFg, fontFace: 'Calibri',
  })
  // Accent left bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 1.2, w: 0.07, h: 6.3,
    fill: { color: theme.accent }, line: { type: 'none' },
  })
}

function addBullets(slide: PptxSlide, bullets: string[], theme: Theme) {
  if (!bullets.length) return
  const bulletObjs = bullets.map(b => ({
    text: b,
    options: { bullet: true, fontSize: 18, color: theme.bodyFg, fontFace: 'Calibri', paraSpaceAfter: 6 }
  }))
  slide.addText(bulletObjs, { x: 0.5, y: 1.4, w: 12.3, h: 5.8 })
}

function addInfographicSlide(
  pptx: PptxGenJS,
  slide: PptxSlide,
  s: Slide,
  theme: Theme
) {
  const inf = s.infographic!
  addTitleBar(pptx, slide, s.title, theme)

  switch (inf.type) {
    case 'timeline': {
      const items = (inf.items || []) as { step: string; label: string; detail?: string }[]
      const colW = 12.0 / Math.max(items.length, 1)
      items.forEach((item, i) => {
        const x = 0.5 + i * colW
        // Circle
        slide.addShape(pptx.ShapeType.ellipse, {
          x: x + colW / 2 - 0.3, y: 1.6, w: 0.6, h: 0.6,
          fill: { color: theme.accent }, line: { type: 'none' },
        })
        // Step number
        slide.addText(item.step, {
          x: x + colW / 2 - 0.3, y: 1.6, w: 0.6, h: 0.6,
          fontSize: 14, bold: true, color: theme.titleFg, align: 'center', valign: 'middle',
        })
        // Line connector (not for last item)
        if (i < items.length - 1) {
          slide.addShape(pptx.ShapeType.rect, {
            x: x + colW / 2 + 0.3, y: 1.87, w: colW - 0.6, h: 0.06,
            fill: { color: theme.accent }, line: { type: 'none' },
          })
        }
        // Label
        slide.addText(item.label, {
          x: x, y: 2.4, w: colW, h: 0.5,
          fontSize: 14, bold: true, color: theme.bodyFg, align: 'center',
        })
        if (item.detail) {
          slide.addText(item.detail, {
            x: x, y: 2.95, w: colW, h: 0.5,
            fontSize: 11, color: theme.bodyFg, align: 'center',
          })
        }
      })
      break
    }
    case 'stats': {
      const items = (inf.items || []) as { value: string; label: string; context?: string }[]
      const cols = Math.min(items.length, 3)
      const colW = 12.0 / cols
      items.slice(0, cols).forEach((item, i) => {
        const x = 0.5 + i * colW
        slide.addText(item.value, {
          x, y: 2.0, w: colW, h: 1.5,
          fontSize: 54, bold: true, color: theme.accent, align: 'center',
        })
        slide.addText(item.label, {
          x, y: 3.55, w: colW, h: 0.5,
          fontSize: 18, bold: true, color: theme.bodyFg, align: 'center',
        })
        if (item.context) {
          slide.addText(item.context, {
            x, y: 4.1, w: colW, h: 0.5,
            fontSize: 12, color: theme.bodyFg, align: 'center',
          })
        }
      })
      break
    }
    case 'comparison': {
      const comp = inf.comparison!
      // Divider
      slide.addShape(pptx.ShapeType.rect, {
        x: 6.5, y: 1.3, w: 0.05, h: 6.0,
        fill: { color: theme.accent }, line: { type: 'none' },
      })
      const cols = [
        { data: comp.left, startX: 0.5 },
        { data: comp.right, startX: 6.65 },
      ] as const
      for (const { data, startX } of cols) {
        slide.addText(data.header, {
          x: startX, y: 1.4, w: 5.8, h: 0.6,
          fontSize: 18, bold: true, color: theme.accent,
        })
        slide.addText(
          data.points.map(p => ({ text: p, options: { bullet: true, fontSize: 15, color: theme.bodyFg, paraSpaceAfter: 5 } })),
          { x: startX, y: 2.1, w: 5.8, h: 5.2 }
        )
      }
      break
    }
    case 'quote': {
      const q = inf.quote!
      // Accent left bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.4, y: 2.0, w: 0.15, h: 3.0,
        fill: { color: theme.accent }, line: { type: 'none' },
      })
      slide.addText(`"${q.quote}"`, {
        x: 0.8, y: 2.0, w: 11.5, h: 3.0,
        fontSize: 24, italic: true, color: theme.bodyFg, valign: 'middle',
      })
      if (q.attribution) {
        slide.addText(`— ${q.attribution}`, {
          x: 0.8, y: 5.2, w: 11.5, h: 0.6,
          fontSize: 16, bold: true, color: theme.accent,
        })
      }
      break
    }
    case 'process': {
      const items = (inf.items || []) as { step: string; title: string; description?: string }[]
      items.slice(0, 5).forEach((item, i) => {
        const y = 1.4 + i * 1.1
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5, y, w: 0.7, h: 0.7,
          fill: { color: theme.accent }, line: { type: 'none' }, rectRadius: 0.1,
        })
        slide.addText(item.step, {
          x: 0.5, y, w: 0.7, h: 0.7,
          fontSize: 16, bold: true, color: theme.titleFg, align: 'center', valign: 'middle',
        })
        slide.addText(item.title, {
          x: 1.4, y: y + 0.02, w: 5.0, h: 0.35,
          fontSize: 15, bold: true, color: theme.bodyFg,
        })
        if (item.description) {
          slide.addText(item.description, {
            x: 1.4, y: y + 0.37, w: 11.2, h: 0.35,
            fontSize: 12, color: theme.bodyFg,
          })
        }
      })
      break
    }
    case 'icon-grid': {
      const items = (inf.items || []) as { icon: string; label: string; description?: string }[]
      const cols = items.length <= 3 ? items.length : items.length <= 6 ? 3 : 4
      const rows = Math.ceil(items.length / cols)
      const cellW = 12.0 / cols
      const cellH = 5.0 / rows
      items.slice(0, 12).forEach((item, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = 0.5 + col * cellW
        const y = 1.6 + row * cellH
        slide.addText(item.icon, {
          x, y, w: cellW, h: 0.7,
          fontSize: 28, align: 'center',
        })
        slide.addText(item.label, {
          x, y: y + 0.7, w: cellW, h: 0.4,
          fontSize: 13, bold: true, color: theme.bodyFg, align: 'center',
        })
        if (item.description) {
          slide.addText(item.description, {
            x, y: y + 1.1, w: cellW, h: 0.5,
            fontSize: 10, color: theme.bodyFg, align: 'center',
          })
        }
      })
      break
    }
    default:
      addBullets(slide, s.mainBullets, theme)
  }
}
