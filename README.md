# Presentation Creator Agent

**You write the lesson. The app designs the presentation.**

A free, self-hosted Gamma-style presentation designer. Paste your lesson text, choose a design style, and get a fully structured slide presentation with infographics, speaker notes, layout suggestions, and PPTX export — all powered by free/local AI or a built-in rule-based engine, with zero paid API required.

---

## Purpose

This app is a **DESIGNER**, not a content generator.

- You write the lesson (sermon, class notes, Bible study, teaching notes)
- The app splits it into slides, formats bullets, generates infographic structures, and applies visual design
- Every bullet point and speaker note traces to your source text
- Nothing is invented, paraphrased, or added

---

## How It Works

1. **Go to `/new`** — paste your lesson text, set audience/tone/style preferences
2. **Submit** — the AI (or rule-based fallback) splits your lesson into slides with infographic detection
3. **Review outline** — check the outline at `/presentations/[id]`
4. **View slide cards** — see each slide at `/presentations/[id]/slides`
5. **Export** — download PPTX, JSON, Markdown, or open a print/PDF view

---

## AI Support

The app uses **free or local AI** for intelligent slide generation. You choose the provider:

| Provider | Description | Cost |
|----------|-------------|------|
| **None** (default) | Fast rule-based parsing — always works | Free |
| **Ollama** | Run models locally (llama3.2, mistral, qwen…) | Free |
| **LM Studio** | Local models via LM Studio GUI | Free |
| **Groq** | Cloud inference, extremely fast — free tier | Free tier |
| **OpenRouter** | Access many free models (Mistral, Llama…) | Free tier |

Configure your AI provider at `/settings` or via environment variables. The app works without any AI provider — the rule-based engine is always available as the fallback.

### Quick Start with Ollama

```bash
# Install Ollama from ollama.com, then:
ollama pull llama3.2

# In the app, go to /settings, select Ollama, and save.
```

---

## Local Setup

### Requirements

- Node.js 20+
- npm 9+

### Install and Run

```bash
git clone https://github.com/boco-cyber/presentation-creator-agent.git
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

## Configuring AI (Optional)

Copy `.env.example` to `.env` and set your preferred provider:

```bash
cp .env.example .env
```

```env
# Choose a provider (default: none — uses rule-based parser)
AI_PROVIDER=ollama

# Ollama (local, free)
OLLAMA_MODEL=llama3.2

# Groq (free tier — get key at console.groq.com)
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-70b-versatile

# OpenRouter (free models — get key at openrouter.ai)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
```

You can also configure the provider live in the app at `/settings` — no restart needed.

---

## Providing Lesson Input

The app works best when your lesson text has clear section headings:

```
# Markdown Heading
## Sub-heading

ALL CAPS HEADING

Section Title:
Short label ending with colon:
```

**Tip:** You can also import `.txt`, `.md`, `.docx`, or `.pdf` files directly via the file import button on the form.

---

## Design Styles

| Style | Description |
|-------|-------------|
| `coptic orthodox` | Gold/maroon/green, EB Garamond, Coptic iconography |
| `youth ministry` | Coral/teal, Poppins, rounded elements, energetic |
| `modern academic` | Navy/white, Source Serif Pro, university clean |
| `clean corporate` | Minimal monochrome, Inter, hairline dividers |
| `dark theme` | Deep navy, sky blue/lavender, high contrast |
| `infographic` | Color-coded, icons, numbered steps, visual data |
| `custom: [desc]` | Best-effort custom style from your description |

---

## Infographic Support

The AI automatically detects when content is better shown as an infographic:

| Type | When Used |
|------|-----------|
| `timeline` | Sequential events or chronological steps |
| `process` | Step-by-step procedures or methods |
| `stats` | Key numbers, percentages, or data points |
| `comparison` | Two sides contrasted (Old vs New, Law vs Grace) |
| `quote` | Single key statement or scripture verse |
| `icon-grid` | Set of qualities, virtues, or categorized items |

All infographic data is extracted from your source lesson — never invented.

---

## Exporting

### PPTX Export
Click **Download PPTX** on the export page. Produces a fully styled `.pptx` file with:
- Title slides
- Content slides with bullets
- Infographic slides (timeline, stats, comparison, process, quote, icon-grid)
- Speaker notes
- Design theme colors

### Other Export Formats

Each presentation also saves these files to `/presentations/[id]/`:

| File | Format | Use |
|------|--------|-----|
| `slides.json` | JSON | Structured data, build custom exporters |
| `outline.md` | Markdown | Quick overview, print outline |
| `slides.md` | Markdown | Marp/reveal.js compatible slide deck |
| `design-notes.md` | Markdown | Per-slide design spec for designers |

### PDF / Print View
Click **Export PDF (Print)** to open a print-optimized view. Use your browser's Print → Save as PDF.

---

## Output File Storage

All generated presentations are stored locally at:

```
presentations/
  [presentation-id]/
    slides.json        # Full structured data
    outline.md         # Slide-by-slide outline
    slides.md          # Markdown slide deck
    design-notes.md    # Design specifications
```

No database required. No cloud storage. Everything stays on your server.

---

## Oracle Cloud Deployment

This app is designed to run on **Oracle Cloud Always Free** (Ubuntu ARM server).

See `docs/DEPLOYMENT_ORACLE_FREE_TIER.md` for full instructions covering:
- Node.js installation
- PM2 process manager
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)
- Firewall configuration
- AI provider configuration

**Quick deploy:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Oracle Free Tier AI options:**
- Run Ollama on the same server (24 GB RAM supports a 3B–7B model)
- Point to a remote Ollama or LM Studio instance via `AI_BASE_URL`
- Use Groq or OpenRouter free tier (no local GPU needed)

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/AGENT_READ_FIRST.md`](docs/AGENT_READ_FIRST.md) | Safety rules, project overview, build commands |
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | Tech stack, purpose, roadmap |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md) | Full data flow and processing pipeline |
| [`docs/AI_ARCHITECTURE.md`](docs/AI_ARCHITECTURE.md) | AI provider system, prompt pipeline, config |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | All design styles with colors and typography |
| [`docs/INFOGRAPHIC_SYSTEM.md`](docs/INFOGRAPHIC_SYSTEM.md) | Infographic types, data structures, rendering |
| [`docs/DEPLOYMENT_ORACLE_FREE_TIER.md`](docs/DEPLOYMENT_ORACLE_FREE_TIER.md) | Oracle Cloud deployment guide |
| [`docs/IMPLEMENTATION_LOG.md`](docs/IMPLEMENTATION_LOG.md) | Change history for developers and agents |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Version history |

---

## Safety Rule

**This app will never generate, expand, or invent teaching content.** Every word in the output is sourced from the lesson text the user provides. The `sourceLessonPreserved: true` flag is set on every presentation object as a contract guarantee.

When AI is used, the system prompt includes hard CRITICAL RULES that prohibit the model from adding unsupported content. The rule-based fallback enforces this strictly in code.

If you are an AI agent working on this codebase: **read `docs/AGENT_READ_FIRST.md` before making any changes.**

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, Node.js runtime)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Storage:** Local filesystem (no database)
- **AI:** Pluggable — Ollama, Groq, OpenRouter, LM Studio, or none
- **Export:** pptxgenjs (PPTX), browser print (PDF), JSON, Markdown
- **Runtime:** Node.js 20+

---

## Repository

**GitHub:** https://github.com/boco-cyber/presentation-creator-agent

**Do not touch:**
This repository is standalone. Never merge, import, or interact with unrelated websites, LMS installations (Canvas, Moodle), Hostinger projects, Cloudflare settings, or other GitHub repos. See `docs/AGENT_READ_FIRST.md` for the full safety rule.
