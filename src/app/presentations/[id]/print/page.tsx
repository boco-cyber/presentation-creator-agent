import { loadPresentation } from '@/lib/storage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const p = loadPresentation(id)
  return { title: p?.title || 'Print View' }
}

export default async function PrintPage({ params }: PageProps) {
  const { id } = await params
  const presentation = loadPresentation(id)
  if (!presentation) notFound()

  return (
    <html>
      <head>
        <style>{`
          @page { size: landscape; margin: 0; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Calibri, Arial, sans-serif; }
          .slide { width: 100vw; height: 100vh; padding: 60px; display: flex; flex-direction: column; page-break-after: always; border: none; }
          .slide-title-slide { background: #1F497D; color: white; justify-content: center; align-items: center; text-align: center; }
          .slide-content { background: white; }
          .slide-num { position: absolute; bottom: 20px; right: 30px; font-size: 11px; color: #999; }
          h1 { font-size: 48px; margin: 0 0 16px; }
          h2 { font-size: 30px; margin: 0 0 24px; border-bottom: 3px solid #1F497D; padding-bottom: 12px; }
          .subtitle { font-size: 22px; opacity: 0.85; }
          ul { font-size: 20px; line-height: 1.8; padding-left: 24px; }
          .speaker-notes { position: absolute; bottom: 0; left: 0; right: 0; background: #f9f9f9; border-top: 1px solid #eee; padding: 10px 60px; font-size: 11px; color: #666; }
          .no-print { padding: 16px; background: #f5f5f5; border-bottom: 1px solid #ddd; display: flex; gap: 12px; align-items: center; }
          .print-btn { padding: 8px 20px; background: #1F497D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
          .print-hint { font-size: 13px; color: #666; }
          @media screen { .slide { border: 2px solid #eee; margin: 20px auto; max-width: 1200px; height: 675px; position: relative; } }
          @media print { .no-print { display: none; } }
        `}</style>
      </head>
      <body>
        <div className="no-print">
          <button className="print-btn" onClick={() => window.print()}>Print / Save as PDF</button>
          <span className="print-hint">{presentation.slides.length} slides &middot; Use browser&apos;s Print &rarr; Save as PDF</span>
        </div>
        {presentation.slides.map((slide) => {
          const isTitle = slide.slideNumber === 1
          return (
            <div key={slide.slideNumber} className={`slide ${isTitle ? 'slide-title-slide' : 'slide-content'}`} style={{ position: 'relative' }}>
              {isTitle ? (
                <>
                  <h1>{slide.title}</h1>
                  {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
                </>
              ) : (
                <>
                  <h2>{slide.title}</h2>
                  {slide.mainBullets.length > 0 && (
                    <ul>{slide.mainBullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                  )}
                </>
              )}
              {slide.speakerNotes && (
                <div className="speaker-notes">
                  Notes: {slide.speakerNotes.slice(0, 300)}{slide.speakerNotes.length > 300 ? '…' : ''}
                </div>
              )}
              <div className="slide-num">{slide.slideNumber} / {presentation.slides.length}</div>
            </div>
          )
        })}
      </body>
    </html>
  )
}
