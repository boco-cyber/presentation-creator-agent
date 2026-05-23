# Workflow

## Complete Flow Diagram

```
User Input (LessonForm.tsx)
        │
        │  title, lessonText, designPlot, audience,
        │  desiredSlideCount, tone, outputStyle,
        │  speakerNotesPreference
        │
        ▼
POST /api/presentations (route.ts)
        │
        │  Validate: title + lessonText required
        │  Apply defaults for optional fields
        │
        ▼
lessonParser.parseLesson(formData)
        │
        │  1. Create title slide (slide 1)
        │  2. Detect headings in lesson text
        │  3. Split into sections
        │  4. Normalize to desiredSlideCount
        │  5. Per section: title, bullets (≤5, ≤10 words),
        │     sourceExcerpt, speakerNotes (from source)
        │
        ▼
designEngine.applyDesign(slides, designPlot)
        │
        │  Resolve design style from designPlot string
        │  For each slide: add backgroundSuggestion,
        │  refine layoutSuggestion, add visualDirection,
        │  add designNotes
        │
        │  DOES NOT TOUCH: title, bullets, speakerNotes
        │
        ▼
Build Presentation object
        │
        │  id: crypto.randomUUID()
        │  title, audience, tone, designPlot, slides, etc.
        │  createdAt: new Date().toISOString()
        │
        ▼
Generate Export Files
        │
        │  generateSlidesJson()     → slides.json
        │  generateOutlineMd()      → outline.md
        │  generateSlidesMd()       → slides.md
        │  generateDesignNotesMd()  → design-notes.md
        │
        ▼
savePresentation() → /presentations/[id]/
        │
        │  Write all 4 files to disk
        │
        ▼
Return { id, slideCount, title }
        │
        ▼
Client redirect → /presentations/[id]
        │
        ▼
User reviews outline → /presentations/[id]/slides
        │
        ▼
Export → /presentations/[id]/export
```

## Heading Detection Rules (lessonParser.ts)

The parser identifies section boundaries using these patterns:

| Pattern | Example | Detected as heading |
|---------|---------|---------------------|
| `# Heading` or `## Heading` | `## The Call of the Talents` | Yes |
| ALL CAPS line (3+ chars) | `INTRODUCTION` | Yes |
| Line ending with `:` (≤60 chars, no period) | `Main Point One:` | Yes |
| Regular paragraph | `The parable begins with a master...` | No |

## Slide Count Normalization

- If sections > desired: adjacent sections are merged proportionally
- If sections < desired: the largest section is split by paragraph boundaries
- Result is always clamped to desiredSlideCount - 1 content slides + 1 title slide

## Speaker Notes Policy

| Preference | What is included |
|------------|-----------------|
| `full` | Complete section body text (from source only) |
| `brief` | First 300 characters of section body |
| `none` | Empty string |

Speaker notes NEVER contain content invented by the app.
