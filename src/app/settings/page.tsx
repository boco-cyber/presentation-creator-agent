'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { AppSettings, AIProviderConfig } from '@/types'
import Header from '@/components/Header'

const PROVIDER_PRESETS: Record<string, Partial<AIProviderConfig>> = {
  none: { baseUrl: '', model: '', apiKey: '' },
  ollama: { baseUrl: 'http://localhost:11434/v1', model: 'llama3.2', apiKey: '' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-70b-versatile', apiKey: '' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'mistralai/mistral-7b-instruct:free', apiKey: '' },
  lmstudio: { baseUrl: 'http://localhost:1234/v1', model: 'local-model', apiKey: '' },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    aiProvider: { provider: 'none', baseUrl: '', model: '', apiKey: '' }
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then((data: AppSettings) => setSettings(data)).finally(() => setLoading(false))
  }, [])

  const handleProviderChange = (provider: AIProviderConfig['provider']) => {
    const preset = PROVIDER_PRESETS[provider] || {}
    setSettings(prev => ({
      ...prev,
      aiProvider: { ...prev.aiProvider, provider, ...preset }
    }))
  }

  const save = async () => {
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  const ai = settings.aiProvider
  const PROVIDERS: { id: AIProviderConfig['provider']; label: string; desc: string }[] = [
    { id: 'none', label: 'None (Rule-based only)', desc: 'No AI — uses fast rule-based parsing. Free, always works.' },
    { id: 'ollama', label: 'Ollama (Local, Free)', desc: 'Run LLMs locally. Install from ollama.com. No API key needed.' },
    { id: 'groq', label: 'Groq (Free tier)', desc: 'Extremely fast inference. Free API key at console.groq.com.' },
    { id: 'openrouter', label: 'OpenRouter (Free models)', desc: 'Access free models like Mistral, Llama. Free key at openrouter.ai.' },
    { id: 'lmstudio', label: 'LM Studio (Local)', desc: 'Run local models via LM Studio GUI. No API key needed.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <nav className="text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-1">/</span>
            <span>AI Settings</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">AI Provider Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure a free AI to power intelligent slide generation and infographics.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Provider</label>
            <div className="space-y-2">
              {PROVIDERS.map(p => (
                <label key={p.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${ai.provider === p.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="provider" value={p.id} checked={ai.provider === p.id} onChange={() => handleProviderChange(p.id)} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {ai.provider !== 'none' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">API Base URL</label>
                <input
                  value={ai.baseUrl}
                  onChange={e => setSettings(prev => ({ ...prev, aiProvider: { ...prev.aiProvider, baseUrl: e.target.value } }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Model</label>
                <input
                  value={ai.model}
                  onChange={e => setSettings(prev => ({ ...prev, aiProvider: { ...prev.aiProvider, model: e.target.value } }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {(ai.provider === 'groq' || ai.provider === 'openrouter') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    value={ai.apiKey || ''}
                    onChange={e => setSettings(prev => ({ ...prev, aiProvider: { ...prev.aiProvider, apiKey: e.target.value } }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="sk-..."
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              {saved ? 'Saved' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">Quick Start: Ollama (recommended for local use)</p>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>Install Ollama from <span className="font-mono">ollama.com</span></li>
            <li>Run: <span className="font-mono bg-amber-100 px-1 rounded">ollama pull llama3.2</span></li>
            <li>Select Ollama above and save</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
