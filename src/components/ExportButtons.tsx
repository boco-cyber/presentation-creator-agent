'use client'
import { useState } from 'react'

interface Props { presentationId: string; title: string }

export default function ExportButtons({ presentationId, title }: Props) {
  const [pptxLoading, setPptxLoading] = useState(false)

  const downloadPptx = async () => {
    setPptxLoading(true)
    const res = await fetch(`/api/presentations/${presentationId}/export/pptx`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pptx`
      a.click()
      URL.revokeObjectURL(url)
    }
    setPptxLoading(false)
  }

  const openPrintView = () => {
    window.open(`/presentations/${presentationId}/print`, '_blank')
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={downloadPptx}
        disabled={pptxLoading}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {pptxLoading ? 'Generating...' : 'Download PPTX'}
      </button>
      <button
        onClick={openPrintView}
        className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Export PDF (Print)
      </button>
    </div>
  )
}
