'use client'
import type { Infographic } from '@/types'

interface Props {
  infographic: Infographic
  accentColor?: string
}

export default function InfographicRenderer({ infographic, accentColor = '#6366f1' }: Props) {
  switch (infographic.type) {
    case 'timeline': {
      const items = (infographic.items || []) as { step: string; label: string; detail?: string }[]
      return (
        <div className="relative flex items-start gap-0 mt-2 overflow-x-auto pb-2">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[80px]">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white z-10" style={{ background: accentColor }}>{item.step}</div>
                {i < items.length - 1 && <div className="flex-1 h-0.5" style={{ background: accentColor }} />}
              </div>
              <p className="text-xs font-semibold text-gray-800 mt-1 text-center">{item.label}</p>
              {item.detail && <p className="text-xs text-gray-500 text-center">{item.detail}</p>}
            </div>
          ))}
        </div>
      )
    }
    case 'stats': {
      const items = (infographic.items || []) as { value: string; label: string; context?: string }[]
      return (
        <div className="grid gap-3 mt-2" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}>
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="rounded-xl border-2 border-opacity-20 p-3 text-center" style={{ borderColor: accentColor }}>
              <p className="text-3xl font-extrabold" style={{ color: accentColor }}>{item.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{item.label}</p>
              {item.context && <p className="text-xs text-gray-500 mt-0.5">{item.context}</p>}
            </div>
          ))}
        </div>
      )
    }
    case 'comparison': {
      const comp = infographic.comparison!
      return (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[comp.left, comp.right].map((col, i) => (
            <div key={i} className="rounded-lg p-3 bg-gray-50 border border-gray-200">
              <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>{col.header}</p>
              <ul className="space-y-1">
                {col.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: accentColor }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    }
    case 'quote': {
      const q = infographic.quote!
      return (
        <div className="mt-2 border-l-4 pl-4 py-2" style={{ borderColor: accentColor }}>
          <p className="text-sm italic text-gray-800">&ldquo;{q.quote}&rdquo;</p>
          {q.attribution && <p className="text-xs font-semibold mt-2" style={{ color: accentColor }}>— {q.attribution}</p>}
        </div>
      )
    }
    case 'process': {
      const items = (infographic.items || []) as { step: string; title: string; description?: string }[]
      return (
        <div className="space-y-2 mt-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: accentColor }}>{item.step}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }
    case 'icon-grid': {
      const items = (infographic.items || []) as { icon: string; label: string; description?: string }[]
      return (
        <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
          {items.slice(0, 8).map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-semibold text-gray-700 mt-1">{item.label}</p>
              {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }
    default:
      return null
  }
}
