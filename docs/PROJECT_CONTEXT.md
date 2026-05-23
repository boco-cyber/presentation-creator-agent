# Project Context

## Repository

**Name:** `presentation-creator-agent`
**Location:** `C:\Users\gerge\presentation-creator-agent\` (development)
**Target deployment:** Oracle Cloud Always Free — Ubuntu ARM (aarch64)

## Purpose

A free, self-hosted alternative to Gamma for designing lesson presentations. The user provides the complete lesson text; the app structures it into slides with applied design styling.

**Core philosophy:** The app is a DESIGNER, not a writer. Content fidelity to the source lesson is the highest priority.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Storage (MVP) | Local filesystem (JSON + Markdown files) |
| Runtime | Node.js 20+ |
| AI (optional) | None required for MVP |

## MVP Storage

Presentations are stored as files under `/presentations/[uuid]/`:

```
presentations/
  [uuid]/
    slides.json         # Complete structured data
    outline.md          # Slide outline
    slides.md           # Each slide as fenced section
    design-notes.md     # Per-slide design specifications
```

No database is required for MVP.

## Future Roadmap

| Feature | Priority | Notes |
|---------|----------|-------|
| PPTX export | High | python-pptx or pptxgenjs |
| PDF export | Medium | Headless Chromium print |
| AI-assisted design (not content) | Low | Optional, gated by env var |
| User accounts | Low | Currently single-user self-hosted |
| Slide theme preview | Medium | Live CSS preview of design styles |

## Target User

Church teachers, Sunday school instructors, ministry leaders, educators, and anyone who writes their own lesson content and needs help structuring it as a visual presentation quickly.
