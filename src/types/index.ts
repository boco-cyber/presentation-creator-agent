export type InfographicType =
  | 'bullets'
  | 'timeline'
  | 'process'
  | 'stats'
  | 'comparison'
  | 'quote'
  | 'icon-grid'
  | 'title'

export interface TimelineItem { step: string; label: string; detail?: string }
export interface ProcessItem { step: string; title: string; description?: string }
export interface StatItem { value: string; label: string; context?: string }
export interface IconGridItem { icon: string; label: string; description?: string }
export interface ComparisonData { left: { header: string; points: string[] }; right: { header: string; points: string[] } }
export interface QuoteData { quote: string; attribution?: string }

export interface Infographic {
  type: InfographicType
  items?: TimelineItem[] | ProcessItem[] | StatItem[] | IconGridItem[]
  comparison?: ComparisonData
  quote?: QuoteData
}

export interface AIProviderConfig {
  provider: 'ollama' | 'groq' | 'openrouter' | 'lmstudio' | 'none'
  baseUrl: string
  apiKey?: string
  model: string
}

export interface AppSettings {
  aiProvider: AIProviderConfig
}

export interface Slide {
  slideNumber: number
  title: string
  subtitle?: string
  mainBullets: string[]
  sourceExcerpt: string
  speakerNotes: string
  backgroundSuggestion: string
  layoutSuggestion: string
  visualDirection: string
  designNotes: string
  infographic?: Infographic
}

export interface Presentation {
  id: string
  title: string
  sourceLessonPreserved: true
  audience: string
  tone: string
  designPlot: string
  slideCount: number
  outputStyle: string
  slides: Slide[]
  createdAt: string
}

export interface LessonFormData {
  title: string
  lessonText: string
  designPlot: string
  audience: string
  desiredSlideCount: number
  tone: string
  outputStyle: string
  speakerNotesPreference: 'full' | 'brief' | 'none'
}

export interface PresentationListItem {
  id: string
  title: string
  slideCount: number
  createdAt: string
  designPlot: string
}

export interface CreatePresentationResponse {
  id: string
  slideCount: number
  title: string
}
