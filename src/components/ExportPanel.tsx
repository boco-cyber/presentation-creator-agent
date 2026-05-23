'use client'

import { useState } from 'react'

interface ExportFile {
  filename: string
  label: string
  description: string
  content: string
  mimeType: string
}

interface ExportPanelProps {
  presentationId: string
  files: ExportFile[]
}

export default function ExportPanel({ presentationId, files }: ExportPanelProps) {
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  function downloadFile(file: ExportFile) {
    const blob = new Blob([file.content], { type: file.mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const activeFile = files.find((f) => f.filename === previewFile)

  return (
    <div className="space-y-6">
      {/* Download buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {files.map((file) => (
          <div
            key={file.filename}
            className="rounded-xl border border-gray-200 bg-white p-5 space-y-3"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{file.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{file.description}</p>
              <code className="text-xs text-indigo-600 font-mono">{file.filename}</code>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => downloadFile(file)}
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors text-center"
              >
                Download
              </button>
              <button
                type="button"
                onClick={() =>
                  setPreviewFile(previewFile === file.filename ? null : file.filename)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {previewFile === file.filename ? 'Hide' : 'Preview'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm font-medium text-gray-500">PPTX Export — Coming Soon</p>
        <p className="text-xs text-gray-400 mt-1">
          PowerPoint export with full design application is planned for a future version.
        </p>
      </div>

      {/* File Preview */}
      {activeFile && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div>
              <span className="text-sm font-semibold text-gray-900">{activeFile.label}</span>
              <code className="ml-2 text-xs text-gray-500">{activeFile.filename}</code>
            </div>
            <button
              type="button"
              onClick={() => setPreviewFile(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
              {activeFile.content}
            </pre>
          </div>
        </div>
      )}

      {/* Presentation ID reference */}
      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Presentation ID:</span>{' '}
          <code className="font-mono text-gray-700">{presentationId}</code>
          <br />
          <span className="mt-1 block">
            Files are saved to <code className="font-mono">/presentations/{presentationId}/</code> on
            the server.
          </span>
        </p>
      </div>
    </div>
  )
}
