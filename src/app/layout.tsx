import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: {
    default: 'Presentation Creator Agent',
    template: '%s | Presentation Creator',
  },
  description:
    'You write the lesson. We design the slides. A free self-hosted presentation designer.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-gray-400">
              Presentation Creator Agent &mdash; You write the lesson. App designs the slides.
              &mdash;{' '}
              <a href="/docs" className="underline hover:text-gray-600">
                Docs
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
