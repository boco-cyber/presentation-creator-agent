# Design System

## Design Styles Reference

All design styles are implemented in `src/lib/designEngine.ts`. They control background suggestions, layout hints, color palettes, typography recommendations, and visual direction — but NEVER lesson content.

---

## 1. Coptic Orthodox

**ID:** `coptic orthodox`

**Purpose:** Formal liturgical presentations for Coptic Orthodox Sunday school, sermons, or religious education.

### Colors
| Role | Value | Name |
|------|-------|------|
| Primary | `#8B0000` | Deep Maroon |
| Accent | `#D4AF37` | Antique Gold |
| Background | `#F5F0E8` | Warm Parchment |
| Text | `#2C1810` | Dark Brown |
| Highlight | `#C5A028` | Icon Gold |

### Typography
- **Title font:** Cinzel or EB Garamond (serif, formal)
- **Body font:** EB Garamond, Georgia (readable serif)
- **Weight:** Regular for body, Semibold for titles

### Layout
- Centered title on full parchment background
- Maroon header band with gold title text
- Coptic cross corner decorations
- Gold horizontal rule dividers between sections
- Footer with Coptic cross motif

### Visual Motif
Traditional Coptic iconography — golden icon borders, maroon drapery, cross dividers, Byzantine aesthetic.

---

## 2. Youth Ministry

**ID:** `youth ministry`

**Purpose:** Engaging, energetic slides for youth groups, VBS, teen Sunday school.

### Colors
| Role | Value | Name |
|------|-------|------|
| Primary | `#FF6B35` | Coral |
| Secondary | `#4ECDC4` | Teal |
| Accent | `#FFE66D` | Yellow |
| Success | `#2ECC71` | Green |
| Purple | `#9B59B6` | Vivid Purple |

### Typography
- **Title font:** Fredoka One, Nunito Black (rounded, friendly)
- **Body font:** Poppins, Nunito (modern sans-serif)
- **Weight:** Bold for headings, Regular for body

### Layout
- Coral-to-teal gradient strip at top
- Large bold headings with wide letter spacing
- Rounded rectangle bullet cards
- Generous padding and line height
- Colorful numbered circles for steps

### Visual Motif
Playful geometric shapes, diagonal color blocks, energetic diagonal dividers, rounded corners throughout.

---

## 3. Modern Academic

**ID:** `modern academic`

**Purpose:** Clean professional academic presentations — lectures, seminars, courses.

### Colors
| Role | Value | Name |
|------|-------|------|
| Primary | `#1A2744` | Deep Navy |
| Accent | `#2563EB` | Academic Blue |
| Background | `#FFFFFF` | White |
| Light BG | `#E8EDF5` | Light Blue-Gray |
| Text secondary | `#64748B` | Slate |

### Typography
- **Title font:** Source Serif Pro, Georgia (academic serif)
- **Body font:** Inter, Helvetica (clean sans)
- **Labels:** Inter Medium (structured hierarchy)

### Layout
- Clean white slides with navy header bar
- Thin 1px navy bottom-border on headings
- Table-friendly two-column grids
- Slide numbers in footer
- Academic footnote space at bottom

### Visual Motif
University aesthetic — clean lines, whitespace hierarchy, structured grid, academic professionalism.

---

## 4. Clean Corporate

**ID:** `clean corporate`

**Purpose:** Business presentations, board reports, professional training.

### Colors
| Role | Value | Name |
|------|-------|------|
| Text | `#18181B` | Charcoal |
| Secondary | `#71717A` | Mid Gray |
| Background | `#FFFFFF` | White |
| Panel | `#F4F4F5` | Light Gray |
| Border | `#E4E4E7` | Zinc Border |

### Typography
- **Title font:** Inter Medium / Semibold
- **Body font:** Inter Regular
- **Scale:** 14–16px body, 24–32px titles

### Layout
- Full white slides
- Hairline 0.5px dividers (no decorative borders)
- Left-aligned all content
- Maximum whitespace
- Business-card minimal style

### Visual Motif
Executive minimal — thin rules, monochrome palette, tight spacing, no decoration.

---

## 5. Dark Theme

**ID:** `dark theme`

**Purpose:** Tech talks, modern conferences, late-night sessions, screen-recorded lessons.

### Colors
| Role | Value | Name |
|------|-------|------|
| Background | `#0F172A` | Deep Navy |
| Panel | `#1E293B` | Dark Panel |
| Text | `#F8FAFC` | Near White |
| Accent | `#38BDF8` | Sky Blue |
| Secondary | `#818CF8` | Lavender |

### Typography
- **Title font:** Inter Semibold
- **Body font:** Inter Regular
- **Code font:** JetBrains Mono, Fira Code

### Layout
- Dark navy background throughout
- Sky blue heading text, white body text
- Subtle glow border: `1px solid rgba(56,189,248,0.4)`
- Dark panel card backgrounds
- High contrast ratios (WCAG AA+)

### Visual Motif
Tech-forward — glowing borders, gradient-from-dark panels, code-friendly monospace accents.

---

## 6. Infographic

**ID:** `infographic`

**Purpose:** Data-heavy lessons, step-by-step processes, visual teaching.

### Colors
| Role | Value | Name |
|------|-------|------|
| Problem | `#FF6B6B` | Coral Red |
| Solution | `#4ECDC4` | Teal |
| Data | `#45B7D1` | Info Blue |
| Success | `#96CEB4` | Sage Green |
| Highlight | `#FFEAA7` | Pale Yellow |

### Typography
- **Title font:** Nunito Black (bold data labels)
- **Body font:** Nunito Regular
- **Numbers:** Impact fallback for large callout figures

### Layout
- Color-coded section backgrounds per topic
- Left column icon slot (circle with colored background)
- Numbered step badges
- Flow arrows between sections
- Data panel cards with large number callouts

### Visual Motif
Visual data storytelling — icons, numbered steps, color-coded categories, flow arrows.

---

## 7. Custom

**Syntax:** `custom: [your description]`

**Example:** `custom: warm earth tones with scripture verse footer`

The engine parses the custom description and maps it to the closest built-in style, then applies it with a note in the designNotes field indicating the requested description. Best-effort approximation.

---

## Using Design Styles in Code

```typescript
import { applyDesign } from '@/lib/designEngine'

const designedSlides = applyDesign(parsedSlides, 'coptic orthodox')
// Each slide now has backgroundSuggestion, layoutSuggestion,
// visualDirection, and designNotes populated.
// Titles, bullets, and speakerNotes are unchanged.
```
