# AI Architecture

## Overview

`presentation-creator-agent` uses a **pluggable, provider-agnostic AI layer** that can call any OpenAI-compatible API endpoint. The app works fully without AI (rule-based fallback mode), and AI is strictly optional — no paid API is required.

The AI layer does one thing: **transform lesson text into structured slide JSON**. It never fabricates content. All prompts include explicit rules that every bullet, title, and speaker note must be traceable to the source lesson.

---

## Provider Abstraction

All providers use the OpenAI Chat Completions API format:

```
POST {baseUrl}/chat/completions
```

This means any OpenAI-compatible endpoint works out of the box: Ollama, LM Studio, Groq, OpenRouter, vLLM, LocalAI, etc.

### Supported Providers

| Provider ID | Description | API Key Required | Cost |
|-------------|-------------|-----------------|------|
| `none` | Rule-based parsing only | No | Free |
| `ollama` | Local Ollama instance | No | Free |
| `lmstudio` | Local LM Studio server | No | Free |
| `groq` | Groq cloud (fast LLMs) | Yes (free tier) | Free tier |
| `openrouter` | OpenRouter (many models) | Yes (free tier) | Free tier |

---

## Configuration

Provider settings are read in this priority order:

1. **Environment variables** (highest priority — override settings file)
2. **`data/settings.json`** (saved via Settings UI)
3. **Defaults** (`none` / rule-based)

### Environment Variables

```bash
# Select provider
AI_PROVIDER=ollama            # ollama | groq | openrouter | lmstudio | none

# Ollama (local, free)
OLLAMA_MODEL=llama3.2         # model name to pull/use

# Groq (free tier at console.groq.com)
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-70b-versatile

# OpenRouter (free models at openrouter.ai)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

# LM Studio (local)
LMSTUDIO_MODEL=local-model

# Generic override (used when AI_PROVIDER is set; takes precedence over above)
AI_API_KEY=
```

### `data/settings.json` Schema

```json
{
  "aiProvider": {
    "provider": "ollama",
    "baseUrl": "http://localhost:11434/v1",
    "model": "llama3.2",
    "apiKey": ""
  }
}
```

This file is written by the Settings UI page (`/settings`) and read at request time.

---

## Provider Endpoint Defaults

| Provider | Default Base URL |
|----------|-----------------|
| `ollama` | `http://localhost:11434/v1` |
| `lmstudio` | `http://localhost:1234/v1` |
| `groq` | `https://api.groq.com/openai/v1` |
| `openrouter` | `https://openrouter.ai/api/v1` |

The base URL is fully configurable — point it at any OpenAI-compatible endpoint, including:
- A remote Ollama server on your LAN
- A vLLM deployment
- A custom inference server
- An Oracle-hosted lightweight model (if resources allow)

---

## Prompt Pipeline

All AI processing happens in `src/lib/aiLessonProcessor.ts`.

### System Prompt Rules (non-negotiable)

The system prompt includes hard constraints that the AI must follow:

```
CRITICAL RULES (never break these):
- Every bullet point, title, and speaker note must come DIRECTLY from the user's lesson text
- Never invent, add, or expand content not present in the source lesson
- Speaker notes = the original lesson text for that section, verbatim or condensed — never invented
- Bullets = extracted from source, never created from scratch
```

These rules are at the top of the system prompt with the word "CRITICAL" to ensure they are respected by the model.

### Slide Type Classification

The AI classifies each slide as one of:

| Type | When to use |
|------|-------------|
| `title` | Cover slide only |
| `bullets` | Standard content (default) |
| `timeline` | Sequential events, dates, ordered steps |
| `process` | Step-by-step procedure or method |
| `stats` | Key numbers, percentages, counts |
| `comparison` | Two sides being contrasted |
| `quote` | Key statement or declaration |
| `icon-grid` | Categorized items with icon representations |

### User Message Template

```
Create a {N}-slide presentation from this lesson.

Title: {title}
Audience: {audience}
Tone: {tone}
Design Style: {designPlot}
Speaker Notes Preference: {full|brief|none}

LESSON TEXT (use ONLY this content):
---
{lessonText}
---

Return exactly {N} slides as a JSON array.
```

### Expected AI Output

The AI returns a JSON array (raw, no markdown fencing):

```json
[
  {
    "slideNumber": 1,
    "type": "title",
    "title": "Lesson Title",
    "subtitle": "Optional subtitle",
    "mainBullets": [],
    "sourceExcerpt": "First line of lesson...",
    "speakerNotes": "From source text only",
    "infographic": null
  },
  {
    "slideNumber": 2,
    "type": "timeline",
    "title": "Key Events",
    "subtitle": "",
    "mainBullets": [],
    "sourceExcerpt": "The events described in the lesson...",
    "speakerNotes": "From source text only",
    "infographic": {
      "type": "timeline",
      "items": [
        { "step": "1", "label": "Event Name", "detail": "from lesson" }
      ]
    }
  }
]
```

### JSON Extraction / Sanitization

Some models wrap JSON in markdown code fences (` ```json ... ``` `). The processor extracts the raw JSON array with a regex before parsing:

```typescript
const jsonMatch = raw.match(/\[[\s\S]*\]/)
```

If extraction fails, the error is caught and the rule-based parser takes over.

---

## Fallback Mode

The fallback is automatic and seamless. When AI is unavailable or fails, `src/lib/lessonParser.ts` runs instead.

```
POST /api/presentations
  → Try AI (aiLessonProcessor.ts)
    → If provider === 'none': throw 'no-ai'
    → If network/model error: throw error
  → On any error: fall back to lessonParser.ts
  → Continue with designEngine.ts, storage.ts
```

The fallback rule-based parser:
- Detects headings (`# Markdown`, `ALL CAPS`, `Short label:`)
- Splits into sections, normalizes to target slide count
- Extracts bullet points from source sentences
- Produces speaker notes from source excerpts
- Never invents content

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `provider === 'none'` | Throws `'no-ai'`, triggers rule-based fallback |
| Network failure | Caught, logged as warning, triggers fallback |
| Model returns non-JSON | JSON extraction fails, triggers fallback |
| JSON parse error | Caught, triggers fallback |
| HTTP error from provider | Error message logged, triggers fallback |

Errors are logged to server console as `[AI] Failed, falling back to rule-based parser:`. The user never sees an error page from an AI failure.

---

## Model Recommendations

For best results on this task (structured JSON output, instruction following, low hallucination):

| Use case | Recommended model |
|----------|-------------------|
| Local (Ollama), fast | `llama3.2` (3B) |
| Local (Ollama), quality | `llama3.1:8b` or `mistral` |
| Local (LM Studio) | Any 7B instruction model |
| Groq (free) | `llama-3.1-70b-versatile` |
| OpenRouter (free) | `mistralai/mistral-7b-instruct:free` |

Avoid models that don't support instruction following or produce verbose output without JSON, as they will fall back to rule-based mode.

---

## Oracle Free-Tier Deployment Considerations

Oracle Always Free provides 4 OCPU + 24 GB RAM (ARM) for the Ampere A1 tier.

**Running inference on the same server:**
- A 3B–7B quantized model (GGUF, Q4) typically needs 3–6 GB RAM
- With 24 GB available, running `llama3.2:3b` via Ollama alongside the Next.js app is feasible
- CPU inference on ARM is slower (5–15 sec/response) but functional

**Running inference on a separate machine (recommended):**
- Set `AI_BASE_URL` to your remote machine's Ollama/LM Studio endpoint
- The Oracle server only runs the Next.js app (lightweight — < 1 GB RAM)
- AI requests go to your home machine or another endpoint over the internet/VPN

**Ollama on Oracle:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a small model
ollama pull llama3.2

# Ollama auto-starts. Set env var:
AI_PROVIDER=ollama
# Base URL defaults to http://localhost:11434/v1
```

**Remote Ollama endpoint:**
```bash
# On your local machine, start Ollama with binding
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# In .env on Oracle:
AI_PROVIDER=ollama
AI_BASE_URL=http://YOUR_HOME_IP:11434/v1
OLLAMA_MODEL=llama3.2
```

---

## Security Notes

- API keys (Groq, OpenRouter) are stored in `data/settings.json` on the server's local filesystem
- `data/settings.json` is excluded from git via `.gitignore`
- API keys are never sent to the browser — all AI calls are server-side (API routes)
- The Settings UI sends keys to the server via HTTPS; they are stored server-side only
- For multi-user or public deployments, add authentication before exposing the Settings page

---

## Source Files

| File | Purpose |
|------|---------|
| `src/lib/aiProvider.ts` | Config loading, `callAI()` function |
| `src/lib/aiLessonProcessor.ts` | System prompt, user message, JSON parsing |
| `src/app/api/settings/route.ts` | GET/POST settings API |
| `src/app/settings/page.tsx` | Settings UI page |
| `data/settings.json` | Runtime settings (git-ignored) |
| `.env.example` | All supported environment variables |
