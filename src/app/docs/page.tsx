import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation',
}

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">Docs</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Everything you need to know about Presentation Creator Agent.
        </p>
      </div>

      {/* What it does */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">What This App Does</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Presentation Creator Agent is a <strong>lesson designer</strong>, not a content
          generator. You provide the complete lesson text — the app structures it into slides by
          detecting headings, splitting content into logical sections, applying visual design
          metadata, and formatting speaker notes from your source text.
        </p>
        <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3">
          <p className="text-sm font-semibold text-green-800 mb-1">What the app DOES:</p>
          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>Splits your lesson into logical slide sections</li>
            <li>Creates a title slide from your presentation title</li>
            <li>Converts section content into bullet points (max 5, max 10 words each)</li>
            <li>Applies design style metadata (backgrounds, colors, layouts, typography)</li>
            <li>Generates speaker notes from your source text excerpts</li>
            <li>Exports structured JSON, Markdown outline, slide deck, and design notes</li>
          </ul>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm font-semibold text-red-800 mb-1">What the app NEVER does:</p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>Invent, expand, or write teaching content</li>
            <li>Paraphrase or reword your lesson text</li>
            <li>Add examples, explanations, or illustrations you didn&apos;t write</li>
            <li>Generate speaker notes from anything outside your source lesson</li>
          </ul>
        </div>
      </section>

      {/* Workflow */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Workflow</h2>
        <ol className="space-y-4">
          {[
            {
              step: 1,
              title: 'Write your lesson',
              detail:
                'Write or paste your complete lesson text in the New Presentation form. Use headings (lines ending with colon, # Markdown headings, or ALL CAPS lines) to help the parser find section breaks.',
            },
            {
              step: 2,
              title: 'Choose a design style',
              detail:
                'Pick one of the 6 built-in styles or describe a custom one. The design style controls colors, typography, background patterns, and layout suggestions.',
            },
            {
              step: 3,
              title: 'Set preferences',
              detail:
                'Choose audience, tone, desired slide count (3–20), and speaker notes preference (full, brief, or none).',
            },
            {
              step: 4,
              title: 'Review the outline',
              detail:
                'After creation, review the slide outline to verify the section splits make sense. All content is from your lesson.',
            },
            {
              step: 5,
              title: 'View slides and export',
              detail:
                'View the designed slide cards with speaker notes and design metadata. Export as JSON, outline.md, slides.md, and design-notes.md.',
            },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-4">
              <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Design Plots */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Design Styles</h2>
        <p className="text-sm text-gray-600">
          Enter one of these values in the Design Style field, or click a preset button on the
          New Presentation form. You can also enter{' '}
          <code className="font-mono text-indigo-600">custom: [description]</code> for a
          best-effort custom style.
        </p>

        <div className="space-y-4">
          {[
            {
              id: 'coptic orthodox',
              label: 'Coptic Orthodox',
              colors: ['#8B0000', '#D4AF37', '#F5F0E8'],
              detail:
                'Gold (#D4AF37) and maroon (#8B0000) on warm parchment. Coptic cross borders. EB Garamond / Cinzel serif fonts. Traditional icon-inspired decorative elements.',
            },
            {
              id: 'youth ministry',
              label: 'Youth Ministry',
              colors: ['#FF6B35', '#4ECDC4', '#FFE66D'],
              detail:
                'Coral to teal gradients. Rounded elements. Poppins / Fredoka One sans-serif. High energy, modern, approachable.',
            },
            {
              id: 'modern academic',
              label: 'Modern Academic',
              colors: ['#1A2744', '#2563EB', '#FFFFFF'],
              detail:
                'Clean white with navy (#1A2744) header. Source Serif Pro for body. Inter for labels. Table-friendly, professional, structured.',
            },
            {
              id: 'clean corporate',
              label: 'Clean Corporate',
              colors: ['#18181B', '#71717A', '#F4F4F5'],
              detail:
                'All white with hairline dividers. Inter font. Maximum whitespace. Monochrome palette. Executive minimal.',
            },
            {
              id: 'dark theme',
              label: 'Dark Theme',
              colors: ['#0F172A', '#38BDF8', '#818CF8'],
              detail:
                'Deep navy (#0F172A) background. Sky blue (#38BDF8) and lavender (#818CF8) accents. High contrast. Inter + JetBrains Mono.',
            },
            {
              id: 'infographic',
              label: 'Infographic',
              colors: ['#FF6B6B', '#4ECDC4', '#FFEAA7'],
              detail:
                'Color-coded sections. Icon slots. Numbered steps. Nunito sans-serif. Visual data storytelling layouts.',
            },
          ].map((style) => (
            <div key={style.id} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex-shrink-0 flex flex-col gap-1 pt-0.5">
                {style.colors.map((c, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{style.label}</p>
                <code className="text-xs text-indigo-600 font-mono">{style.id}</code>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{style.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* File Formats */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Export File Formats</h2>

        <div className="space-y-3">
          {[
            {
              file: 'slides.json',
              desc: 'Complete structured JSON with all slide data including title, bullets, source excerpt, speaker notes, background, layout, visual direction, and design notes. Use this to build custom exporters.',
            },
            {
              file: 'outline.md',
              desc: 'A clean Markdown outline: presentation metadata at top, then each slide as ## Slide N: Title with bullet list.',
            },
            {
              file: 'slides.md',
              desc: 'Each slide as a fenced section (--- delimited) with front matter, heading, bullets, speaker notes, and design hints. Compatible with reveal.js and similar tools.',
            },
            {
              file: 'design-notes.md',
              desc: 'Per-slide design specifications: layout type, background suggestion, visual direction, and typography/color notes. Hand off to a designer or use in your PPTX tool.',
            },
          ].map(({ file, desc }) => (
            <div key={file}>
              <code className="text-sm font-mono font-semibold text-indigo-700">{file}</code>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Oracle Deployment */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Deployment — Oracle Cloud Free Tier</h2>
        <p className="text-sm text-gray-600">
          This app runs on Node.js 20+ and can be self-hosted on Oracle Cloud Always Free
          (Ubuntu ARM). See{' '}
          <code className="font-mono text-indigo-600">docs/DEPLOYMENT_ORACLE_FREE_TIER.md</code>{' '}
          for the full guide covering: package installation, Node.js setup, PM2 process
          management, Nginx reverse proxy, and firewall configuration.
        </p>
        <div className="rounded-lg bg-gray-900 px-4 py-3">
          <pre className="text-xs text-green-400 font-mono overflow-x-auto">{`# Quick start (Ubuntu)
git clone [your-repo] && cd presentation-creator-agent
npm install && npm run build
npm start            # or: pm2 start npm -- start`}</pre>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/new"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Create Your First Presentation
        </Link>
      </div>
    </div>
  )
}
