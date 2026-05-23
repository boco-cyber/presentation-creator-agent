# AGENT READ FIRST

## What This Repository Is

`presentation-creator-agent` is a **lesson-to-slides designer**. It is NOT a content generator.

The user writes their own lesson (sermon, teaching, class notes). The app takes that lesson and designs it as presentation slides: splitting it into sections, formatting bullets, applying visual design metadata, and generating speaker notes from the source text.

## What This Repo MUST NOT Do

- **NEVER invent teaching content** — no additional explanations, examples, or context beyond what the user wrote
- **NEVER paraphrase or reword** lesson text
- **NEVER generate speaker notes** from anything other than the user's source lesson excerpt
- **NEVER modify** titles, bullets, or notes after they are parsed from the lesson (designEngine only adds design fields)

## Correct Workflow

```
User writes lesson → LessonForm.tsx → POST /api/presentations
→ lessonParser.ts (parse sections → slides)
→ designEngine.ts (add visual design metadata only)
→ storage.ts (save to /presentations/[id]/)
→ Redirect to /presentations/[id] (outline)
→ User reviews → /slides → /export
```

## Folder Structure

```
src/
  app/              Next.js App Router pages and API routes
  components/       Reusable UI components
  lib/              Core logic (parser, design engine, exporters, storage)
  prompts/          Design style templates
  types/            TypeScript types
presentations/      Local file storage (created at runtime)
docs/               Documentation
examples/           Sample lesson input and output
```

## Build and Test Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npm start            # Production server (after build)
```

## Documentation Rules

- Keep `docs/IMPLEMENTATION_LOG.md` updated when making significant changes
- Keep `docs/CHANGELOG.md` updated with version entries
- Do not modify `docs/AGENT_READ_FIRST.md` unless the project purpose changes

## Safety Rules

- Do NOT touch other projects in `C:\Users\gerge\`
- Do NOT write to files outside this project directory
- Do NOT add any logic that would cause the app to generate, expand, or rephrase lesson content
- Do NOT add AI API calls without documenting them clearly in IMPLEMENTATION_LOG.md and gating them behind environment variables that default to disabled
