# Changelog

All notable changes to `presentation-creator-agent` will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
