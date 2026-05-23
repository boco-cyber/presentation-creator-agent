# Infographic System

## Overview

The infographic system automatically detects when lesson content is better communicated as a visual structure rather than plain bullet points. Each slide can optionally carry an `infographic` definition that drives both the in-browser `InfographicRenderer` and the PPTX exporter.

Infographics are **data structures derived from source content only** — they are never independently generated. Every value inside an infographic block is extracted from the user's lesson text.

---

## Supported Infographic Types

### 1. `bullets` (default)
Standard bullet-point list. Used for most content slides.

```json
{ "type": "bullets" }
```

No infographic definition needed. The `mainBullets` array drives the display.

---

### 2. `timeline`
Sequential events, dates, milestones, or chronological steps.

**When to use:**
- Lesson contains a series of historical events
- Numbered sequence of steps that happened over time
- "First… then… finally…" narrative structure

**Data structure:**
```json
{
  "type": "timeline",
  "items": [
    { "step": "1", "label": "Event Name", "detail": "detail from lesson" },
    { "step": "2", "label": "Second Event", "detail": "detail from lesson" },
    { "step": "3", "label": "Third Event", "detail": "detail from lesson" }
  ]
}
```

**Visual output:**
- Horizontal row of numbered circles connected by a colored line
- Label below each circle
- Optional detail text beneath each label
- Accent color from the chosen design style

---

### 3. `process`
Step-by-step procedures, methods, or sequential instructions.

**When to use:**
- "How to" content
- Numbered steps for completing an action
- Workflow or method description
- Theological or liturgical sequence (e.g., sacrament steps)

**Data structure:**
```json
{
  "type": "process",
  "items": [
    { "step": "1", "title": "Step Title", "description": "from lesson" },
    { "step": "2", "title": "Step Title", "description": "from lesson" },
    { "step": "3", "title": "Step Title", "description": "from lesson" }
  ]
}
```

**Visual output:**
- Vertical list with numbered square badges on the left
- Title text next to each badge
- Optional description text below title
- Up to 5 steps displayed

---

### 4. `stats`
Key numbers, percentages, counts, or data points from the lesson.

**When to use:**
- Lesson contains significant numerical data
- Scripture verse counts, historical dates, population numbers
- Percentages or proportions being discussed
- "X out of Y" comparisons

**Data structure:**
```json
{
  "type": "stats",
  "items": [
    { "value": "40", "label": "Days in the Desert", "context": "from lesson" },
    { "value": "12", "label": "Apostles", "context": "from lesson" },
    { "value": "3", "label": "Days in the Tomb", "context": "from lesson" }
  ]
}
```

**Visual output:**
- 1–3 large-number cards in a row
- Giant colored number/value
- Label below
- Optional context line
- Up to 3 stat blocks per slide

---

### 5. `comparison`
Two sides of a contrast: before/after, yes/no, two theological concepts, etc.

**When to use:**
- Lesson explicitly compares two things
- "On one hand… on the other hand…"
- Old vs New, Law vs Grace, Earthly vs Heavenly
- Two options being contrasted

**Data structure:**
```json
{
  "type": "comparison",
  "comparison": {
    "left": {
      "header": "Left Side Label",
      "points": ["point from lesson", "point from lesson"]
    },
    "right": {
      "header": "Right Side Label",
      "points": ["point from lesson", "point from lesson"]
    }
  }
}
```

**Visual output:**
- Two-column layout with a center divider
- Each column has a colored header
- Bullet points under each header
- Accent color from design style

---

### 6. `quote`
A single key statement, declaration, or scriptural verse.

**When to use:**
- Scripture quotation is the focus of a slide
- A key declaration from the lesson ("The most important thing is…")
- A historical quote being discussed
- A definition being introduced

**Data structure:**
```json
{
  "type": "quote",
  "quote": {
    "quote": "The exact text of the quote from the lesson",
    "attribution": "Source or speaker (optional)"
  }
}
```

**Visual output:**
- Large italic text in quotes
- Colored left border bar
- Attribution line below (if provided)

---

### 7. `icon-grid`
A categorized set of items best represented with symbolic icons.

**When to use:**
- List of qualities, virtues, or attributes
- Set of categories or topic areas
- "Fruits of the Spirit", "Gifts of the Holy Spirit", "Works of mercy" style lists
- Features or characteristics being introduced

**Data structure:**
```json
{
  "type": "icon-grid",
  "items": [
    { "icon": "✝️", "label": "Faith", "description": "from lesson" },
    { "icon": "❤️", "label": "Love", "description": "from lesson" },
    { "icon": "🕊️", "label": "Peace", "description": "from lesson" }
  ]
}
```

**Visual output:**
- Grid of icon cards (2–4 columns depending on count)
- Large emoji/icon centered in each card
- Label below
- Optional description text
- Up to 8 items (12 in PPTX)

---

## Data Extraction Rules

When the AI processes a lesson, it follows these rules for deciding whether to use an infographic:

### Decision Logic

```
1. Read the slide's source content
2. Does it contain a numbered or chronological sequence of 3+ items?
   → Use timeline or process
3. Does it contain significant numerical data (3 or fewer key numbers)?
   → Use stats
4. Does it explicitly contrast two things side by side?
   → Use comparison
5. Is it a single important quote or declaration?
   → Use quote
6. Is it a list of 4–8 categorized items (qualities, features, attributes)?
   → Use icon-grid
7. Otherwise
   → Use bullets (default)
```

### Content Fidelity Rule

**All infographic data must come from the source lesson.** The AI is instructed:
- Extract values verbatim where possible
- Shorten for display, but do not add unsupported context
- Icons in `icon-grid` are the only "creative" addition — using standard Unicode emojis to represent the label

---

## Rendering Architecture

Infographics are rendered in two contexts:

### 1. Browser (React component)

**File:** `src/components/InfographicRenderer.tsx`

- Takes an `Infographic` object as a prop
- Renders fully with Tailwind CSS (no canvas, no bitmap images)
- Accent color is configurable (passed from parent)
- Used in `SlideCard.tsx` on the `/slides` page
- Pure HTML/CSS — lightweight, no JS dependencies

### 2. PPTX Export (pptxgenjs)

**File:** `src/lib/exporters/pptxExporter.ts`

- Each infographic type has a dedicated rendering function
- Uses pptxgenjs shapes, text, and positioning
- Design theme colors are applied from the presentation's `designPlot`
- Speaker notes are added to each slide's notes area

### 3. Print / PDF View

**File:** `src/app/presentations/[id]/print/page.tsx`

- CSS print-optimized layout
- Uses the same `InfographicRenderer` component
- Each slide on its own print section
- `@media print` CSS handles page breaks

---

## Infographic JSON in Presentation Files

Infographic definitions are persisted in `presentations/[id]/slides.json`:

```json
{
  "slideNumber": 3,
  "title": "The Three Gifts",
  "mainBullets": [],
  "infographic": {
    "type": "stats",
    "items": [
      { "value": "Gold", "label": "For the King", "context": "from lesson" },
      { "value": "Frankincense", "label": "For the Priest", "context": "from lesson" },
      { "value": "Myrrh", "label": "For the Burial", "context": "from lesson" }
    ]
  }
}
```

They are also described in `presentations/[id]/design-notes.md`.

---

## Rule-Based Infographic Detection (Fallback)

When no AI is configured, the rule-based parser (`lessonParser.ts`) does not generate infographic definitions. Slides use the `bullets` layout only.

Future enhancement: add heuristic detection in `lessonParser.ts` for:
- Numbered list patterns → `process`
- Year/date patterns → `timeline`
- Number-heavy lines → `stats`

---

## Adding New Infographic Types

To add a new type (e.g., `pyramid`, `cycle`, `map`):

1. Add the type string to `InfographicType` in `src/types/index.ts`
2. Add the data interface to `src/types/index.ts`
3. Add a `case` block to `InfographicRenderer.tsx`
4. Add a rendering function to `pptxExporter.ts`
5. Document the type and its `when-to-use` criteria here
6. Update the AI system prompt in `aiLessonProcessor.ts` to include the new type

---

## Source Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | `Infographic`, `InfographicType`, and data interfaces |
| `src/components/InfographicRenderer.tsx` | Browser rendering (React/Tailwind) |
| `src/lib/exporters/pptxExporter.ts` | PPTX rendering (pptxgenjs) |
| `src/lib/aiLessonProcessor.ts` | AI prompt instructions for type selection |
| `src/app/presentations/[id]/print/page.tsx` | Print/PDF view |
