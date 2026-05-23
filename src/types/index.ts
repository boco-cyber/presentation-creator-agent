export interface Slide {
  slideNumber: number
  title: string
  mainBullets: string[]
  sourceExcerpt: string
  speakerNotes: string
  backgroundSuggestion: string
  layoutSuggestion: string
  visualDirection: string
  designNotes: string
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
