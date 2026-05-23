# AGENT READ FIRST

## What This Repository Is

`presentation-creator-agent` is a **lesson-to-slides designer**. It is NOT a content generator.

The user writes their own lesson (sermon, teaching, class notes). The app takes that lesson and designs it as presentation slides: splitting it into sections, formatting bullets, applying visual design metadata, generating infographic structures, and creating speaker notes from the source text.

## What This Repo MUST NOT Do

- **NEVER invent teaching content** — no additional explanations, examples, or context beyond what the user wrote
- **NEVER paraphrase or reword** lesson text
- **NEVER generate speaker notes** from anything other than the user's source lesson excerpt
- **NEVER modify** titles, bullets, or notes after they are parsed from the lesson (designEngine only adds design fields)
- **NEVER touch other projects** — see Safety Rules below

## Correct Processing Workflow

### AI-Assisted Path (when AI provider is configured)
```
User lesson → POST /api/presentations
→ aiLessonProcessor.ts (calls AI with strict prompt)
  → AI returns JSON slide array (bullets sourced from lesson only)
→ designEngine.ts (add visual design metadata only)
→ storage.ts (save to /presentations/[id]/)
→ Redirect to /presentations/[id] (outline)
→ User reviews → /slides → /export
```

### Rule-Based Path (fallback or when provider = 'none')
```
User lesson → POST /api/presentations
→ lessonParser.ts (detect headings, split into sections)
  → Title slide + content slides (all text from source only)
→ designEngine.ts (add visual design metadata only)
→ storage.ts (save to /presentations/[id]/)
→ Redirect to /presentations/[id] (outline)
→ User reviews → /slides → /export
```

The AI path falls back to rule-based automatically on any failure. The user never sees an error from AI failure.

## AI Architecture (Summary)

- All AI providers use OpenAI-compatible Chat Completions API format
- Provider configured via `/settings` UI or environment variables
- `data/settings.json` stores provider settings (git-ignored)
- Supported: `ollama`, `groq`, `openrouter`, `lmstudio`, `none`
- System prompt includes hard CRITICAL RULES against content invention

See `docs/AI_ARCHITECTURE.md` for full detail.

## Infographic System (Summary)

- AI classifies slides as: `bullets`, `timeline`, `process`, `stats`, `comparison`, `quote`, `icon-grid`
- Infographic data is always derived from source lesson text
- Rendered in browser by `InfographicRenderer.tsx`
- Rendered in PPTX by `pptxExporter.ts`

See `docs/INFOGRAPHIC_SYSTEM.md` for full detail.

## Folder Structure

```
src/
  app/              Next.js App Router pages and API routes
  components/       Reusable UI components (SlideCard, InfographicRenderer…)
  lib/              Core logic (parser, AI processor, design engine, exporters, storage)
  prompts/          Design style templates
  types/            TypeScript types (Slide, Presentation, Infographic…)
presentations/      Local file storage (created at runtime, git-ignored)
data/               Settings storage (settings.json, git-ignored)
docs/               Documentation
examples/           Sample lesson input and output
scripts/            Deployment and utility scripts
```

## Key Source Files

| File | Purpose |
|------|---------|
| `src/lib/lessonParser.ts` | Rule-based lesson splitter (fallback) |
| `src/lib/aiLessonProcessor.ts` | AI prompt and slide JSON parsing |
| `src/lib/aiProvider.ts` | Provider config, `callAI()` function |
| `src/lib/designEngine.ts` | Visual design metadata (never modifies text) |
| `src/lib/storage.ts` | Local filesystem persistence |
| `src/lib/exporters/pptxExporter.ts` | PPTX generation |
| `src/components/InfographicRenderer.tsx` | Browser infographic rendering |
| `src/types/index.ts` | All TypeScript interfaces |

## Build and Test Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npm start            # Production server (after build)
```

## Documentation Rules

- Read this file before making any changes
- Read `docs/AI_ARCHITECTURE.md` before touching AI-related files
- Read `docs/INFOGRAPHIC_SYSTEM.md` before touching infographic rendering
- Update `docs/IMPLEMENTATION_LOG.md` when making significant changes
- Update `docs/CHANGELOG.md` with version entries for user-visible changes
- Do not modify this file unless the project purpose changes

## Safety Rules

- **CRITICAL:** Do NOT touch other projects in `C:\Users\gerge\`
- **CRITICAL:** Do NOT write to files outside this project directory
- Do NOT add any logic that would cause the app to generate, expand, or rephrase lesson content
- Do NOT add AI API calls without documenting them in IMPLEMENTATION_LOG.md and gating them behind environment variables that default to disabled
- Do NOT commit secrets, API keys, or the `data/settings.json` file
- If target path/repo is ambiguous, stop and ask for clarification before proceeding

## What Is Off-Limits (Repository Safety Rule)

Never modify, access, or interact with:
- Other websites or apps on the same machine
- Canvas or Moodle LMS installations
- Hostinger projects
- Cloudflare settings
- Other GitHub repositories
- Server configs outside this project
- Databases not belonging to this project
