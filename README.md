# Presentation Creator Agent

**You write the lesson. The app designs the presentation.**

A free, self-hosted Gamma-like presentation designer. Paste your lesson text, choose a design style, and get a fully structured slide presentation with speaker notes, layout suggestions, and exportable files — all without inventing a single word of content.

---

## Purpose

This app is a **DESIGNER**, not a content generator.

- You write the lesson (sermon, class notes, Bible study, teaching)
- The app splits it into slides, formats bullets, applies visual design
- Every bullet point and speaker note traces to your source text
- Nothing is invented, paraphrased, or added

---

## How It Works

1. **Go to `/new`** — paste your lesson text, choose a design style, set your preferences
2. **Submit** — the rule-based parser splits your lesson into slides and applies design metadata
3. **Review** — check the outline at `/presentations/[id]`
4. **View slides** — see each slide card at `/presentations/[id]/slides`
5. **Export** — download `slides.json`, `outline.md`, `slides.md`, `design-notes.md`

---

## Local Setup

### Requirements
- Node.js 20+
- npm 9+

### Install and Run

```bash
git clone https://github.com/YOUR_USERNAME/presentation-creator-agent.git
cd presentation-creator-agent

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Providing Lesson Input

The app works best when your lesson text has clear section headings. Any of these heading formats are detected automatically:

```
# Markdown Heading
## Sub-heading

ALL CAPS HEADING

Section Title:
Short label ending with colon:
```

**Tip:** Write your lesson in a document editor first, then paste the complete text into the form. The more structured your lesson, the cleaner the slide splits.

---

## Design Styles

| Style ID | Description |
|----------|-------------|
| `coptic orthodox` | Gold/maroon, serif fonts, Coptic cross motifs |
| `youth ministry` | Bright coral/teal, Poppins, rounded elements |
| `modern academic` | Navy/white, Source Serif Pro, clean grid |
| `clean corporate` | Minimal monochrome, Inter, hairline dividers |
| `dark theme` | Deep navy, sky blue accents, high contrast |
| `infographic` | Color-coded sections, icons, numbered steps |
| `custom: [desc]` | Best-effort custom style from your description |

---

## Exporting

Each presentation saves 4 files to `/presentations/[id]/`:

| File | Format | Use |
|------|--------|-----|
| `slides.json` | JSON | Structured data, build custom exporters |
| `outline.md` | Markdown | Quick overview, print outline |
| `slides.md` | Markdown | reveal.js compatible slide deck |
| `design-notes.md` | Markdown | Hand off to designer or PPTX tool |

PPTX export is planned for a future version.

---

## Oracle Cloud Deployment

This app is designed to run on Oracle Cloud Always Free (Ubuntu ARM). See:

```
docs/DEPLOYMENT_ORACLE_FREE_TIER.md
```

For complete instructions: Node.js setup, PM2, Nginx, firewall, HTTPS.

---

## Documentation

| File | Contents |
|------|----------|
| `docs/AGENT_READ_FIRST.md` | Safety rules, project overview, build commands |
| `docs/PROJECT_CONTEXT.md` | Tech stack, purpose, roadmap |
| `docs/WORKFLOW.md` | Full data flow diagram |
| `docs/DESIGN_SYSTEM.md` | All design styles with colors and typography |
| `docs/DEPLOYMENT_ORACLE_FREE_TIER.md` | Oracle Cloud deployment guide |
| `docs/IMPLEMENTATION_LOG.md` | Change history for developers/agents |
| `docs/CHANGELOG.md` | Version history |

---

## Safety Rule

**This app will never generate, expand, or invent teaching content.** Every word in the output is sourced from the lesson text the user provides. The `sourceLessonPreserved: true` flag is set on every presentation object as a contract guarantee.

If you are an AI agent working on this codebase: read `docs/AGENT_READ_FIRST.md` before making any changes.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Storage:** Local filesystem (no database)
- **Runtime:** Node.js 20+
- **AI required:** No (MVP is fully rule-based)
