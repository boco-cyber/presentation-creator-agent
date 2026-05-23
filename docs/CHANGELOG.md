# Changelog

All notable changes to `presentation-creator-agent` will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.2.0] — 2026-05-23

### Added

#### AI Provider System
- Pluggable AI provider architecture (`src/lib/aiProvider.ts`)
- Supported providers: `ollama`, `groq`, `openrouter`, `lmstudio`, `none`
- All providers use OpenAI-compatible Chat Completions API format
- Provider configuration via `/settings` UI or environment variables
- Runtime settings persisted in `data/settings.json` (git-ignored)
- Automatic fallback to rule-based parser on any AI failure

#### AI Lesson Processor
- `src/lib/aiLessonProcessor.ts` — sends lesson to AI with strict CRITICAL RULES system prompt
- AI classifies each slide as: `bullets`, `timeline`, `process`, `stats`, `comparison`, `quote`, `icon-grid`
- JSON extraction handles models that wrap output in markdown code fences
- All bullets, titles, and speaker notes must be sourced from lesson (enforced in system prompt)

#### Infographic System
- 6 infographic types: timeline, process, stats, comparison, quote, icon-grid
- `InfographicRenderer.tsx` — browser rendering with Tailwind CSS (no canvas/bitmap)
- Infographic data persisted in `slides.json` and `design-notes.md`

#### PPTX Export
- `src/lib/exporters/pptxExporter.ts` — full PPTX generation via pptxgenjs
- All 6 infographic types rendered as native PPTX shapes and text
- Theme colors applied from chosen design style
- Speaker notes added to each slide's notes area
- `GET /api/presentations/[id]/export/pptx` — streaming download

#### PDF / Print Export
- `/presentations/[id]/print` — CSS print-optimized view
- Each slide in a print section with `@media print` page-break handling
- Works with browser's Print → Save as PDF

#### File Import
- `POST /api/import` — extract text from uploaded `.txt`, `.md`, `.docx`, `.pdf` files
- Powered by `mammoth` (DOCX) and `pdf-parse` (PDF)
- Populated directly into the lesson text area

#### Settings Page
- `/settings` — AI Provider Configuration UI
- Provider presets with one-click setup (Ollama, Groq, OpenRouter, LM Studio)
- API base URL, model name, and API key fields
- Live save to `data/settings.json`

#### New Pages
- `/settings` — AI provider configuration
- `/presentations/[id]/print` — print/PDF export view

#### New API Routes
- `POST /api/import` — file import
- `GET /api/settings`, `POST /api/settings` — settings management
- `GET /api/presentations/[id]/export/pptx` — PPTX download
- `GET /api/presentations/[id]/export/pdf` — PDF print view redirect

#### Documentation
- `docs/AI_ARCHITECTURE.md` — complete AI provider architecture, prompt pipeline, Oracle deployment notes
- `docs/INFOGRAPHIC_SYSTEM.md` — all infographic types, data structures, rendering architecture

#### Scripts
- `scripts/setup.sh` — Oracle Free-Tier Ubuntu server setup script

### Changed
- Updated `README.md` to document AI features, PPTX export, and all providers
- Updated `docs/AGENT_READ_FIRST.md` with AI workflow, key source files table, and infographic summary
- `src/types/index.ts` — added `AIProviderConfig`, `AppSettings`, infographic data interfaces

### Build Results (v0.2.0)
- `npm run build` — passes, zero errors, 15 routes compiled
- `npm run lint` — passes, zero ESLint warnings or errors

---

## [0.1.0] — 2026-05-23

### Added

#### Core
- Rule-based lesson parser (`lessonParser.ts`) that splits user-provided lesson text into slides
- Design engine (`designEngine.ts`) with 6 built-in styles and custom style support
- Local filesystem storage with 4 export formats per presentation
- TypeScript types for all data structures with `sourceLessonPreserved: true` flag

#### Design Styles
- Coptic Orthodox — gold/maroon palette, serif fonts, Coptic cross motifs
- Youth Ministry — bright coral/teal, rounded elements, Poppins font
- Modern Academic — navy/white, Source Serif Pro, table-friendly layouts
- Clean Corporate — minimal monochrome, Inter font, hairline dividers
- Dark Theme — deep navy, sky blue accents, high contrast
- Infographic — color-coded sections, icon slots, numbered steps
- Custom style support via `custom: [description]` prefix

#### Pages
- Home page (`/`) with hero, features, design style badges, recent presentations list
- New Presentation form (`/new`) with design preset buttons and color swatches
- Outline preview (`/presentations/[id]`) with accordion slide list
- Slide cards view (`/presentations/[id]/slides`) with design notes
- Export page (`/presentations/[id]/export`) with file preview and download
- Documentation page (`/docs`) with full usage guide

#### API
- `POST /api/presentations` — Create presentation from lesson input
- `GET /api/presentations/[id]` — Retrieve presentation by ID

#### Exports
- `slides.json` — Complete structured data
- `outline.md` — Slide-by-slide Markdown outline
- `slides.md` — Each slide as fenced section (reveal.js compatible)
- `design-notes.md` — Per-slide design specifications

#### Documentation
- `docs/AGENT_READ_FIRST.md` — Agent safety rules and project overview
- `docs/PROJECT_CONTEXT.md` — Tech stack and target environment
- `docs/WORKFLOW.md` — Complete data flow diagram
- `docs/DESIGN_SYSTEM.md` — All design styles documented
- `docs/DEPLOYMENT_ORACLE_FREE_TIER.md` — Full Oracle Cloud deployment guide

#### Examples
- `examples/sample-lesson-input.md` — Parable of the Talents lesson
- `examples/sample-presentation-output.md` — Expected output for sample lesson

### Philosophy Enforced
- App NEVER invents teaching content
- All bullets and speaker notes trace to user's source lesson
- `sourceLessonPreserved: true` flag in all output JSON
- Design engine only adds metadata fields — never touches content fields
