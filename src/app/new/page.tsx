import type { Metadata } from 'next'
import Link from 'next/link'
import LessonForm from '@/components/LessonForm'

export const metadata: Metadata = {
  title: 'New Presentation',
}

export default function NewPresentationPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">New Presentation</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Create New Presentation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste your lesson below. The app will structure it into slides — without
          adding any content.
        </p>
      </div>

      <LessonForm />
    </div>
  )
}
