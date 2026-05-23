// Unified AI provider — all use OpenAI-compatible format
// Reads config from: /data/settings.json (falls back to env vars, then 'none')

import fs from 'fs'
import path from 'path'
import type { AIProviderConfig, AppSettings } from '@/types'

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

export function loadSettings(): AppSettings {
  const defaults: AppSettings = {
    aiProvider: {
      provider: 'none',
      baseUrl: '',
      model: '',
    },
  }
  // Check env vars first (override settings file)
  const envProvider = process.env.AI_PROVIDER as AIProviderConfig['provider'] | undefined
  if (envProvider && envProvider !== 'none') {
    const presets: Record<string, Partial<AIProviderConfig>> = {
      ollama: { baseUrl: 'http://localhost:11434/v1', model: process.env.OLLAMA_MODEL || 'llama3.2' },
      groq: { baseUrl: 'https://api.groq.com/openai/v1', model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile' },
      openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct:free' },
      lmstudio: { baseUrl: 'http://localhost:1234/v1', model: process.env.LMSTUDIO_MODEL || 'local-model' },
    }
    return {
      aiProvider: {
        provider: envProvider,
        baseUrl: presets[envProvider]?.baseUrl || '',
        model: presets[envProvider]?.model || '',
        apiKey: process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY,
      },
    }
  }
  // Load from settings file
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
      return JSON.parse(raw) as AppSettings
    }
  } catch { /* ignore */ }
  return defaults
}

export function saveSettings(settings: AppSettings): void {
  const dir = path.dirname(SETTINGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8')
}

export async function callAI(
  config: AIProviderConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  if (config.provider === 'none' || !config.baseUrl) {
    throw new Error('No AI provider configured')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://presentation-creator-agent.app'
    headers['X-Title'] = 'Presentation Creator Agent'
  }

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI provider error ${res.status}: ${err}`)
  }

  const data = await res.json() as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content
}
