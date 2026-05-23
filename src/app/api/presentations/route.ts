/**
 * POST /api/presentations
 *
 * Creates a new presentation from the user's lesson input.
 * Uses rule-based parsing and design engine — no AI required for MVP.
 */

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { parseLesson } from '@/lib/lessonParser'
import { applyDesign } from '@/lib/designEngine'
import { savePresentation } from '@/lib/storage'
import { generateSlidesJson } from '@/lib/exporters/jsonExporter'
import { generateOutlineMd, generateSlidesMd, generateDesignNotesMd } from '@/lib/exporters/markdownExporter'
import type { LessonFormData, Presentation, CreatePresentationResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as LessonFormData

    // Validate required fields
    if (!body.title || !body.lessonText) {
      return NextResponse.json(
        { error: 'title and lessonText are required' },
        { status: 400 }
      )
    }

    if (!body.lessonText.trim()) {
      return NextResponse.json(
        { error: 'lessonText cannot be empty' },
        { status: 400 }
      )
    }

    // Sanitize and apply defaults
    const formData: LessonFormData = {
      title: body.title.trim(),
      lessonText: body.lessonText,
      designPlot: body.designPlot || 'clean corporate',
      audience: body.audience || 'General audience',
      desiredSlideCount: Math.max(3, Math.min(20, body.desiredSlideCount || 8)),
      tone: body.tone || 'Professional',
      outputStyle: body.outputStyle || 'presentation',
      speakerNotesPreference: body.speakerNotesPreference || 'full',
    }

    // Step 1: Parse lesson into slides
    const parsedSlides = parseLesson(formData)

    // Step 2: Apply design metadata
    const designedSlides = applyDesign(parsedSlides, formData.designPlot)

    // Step 3: Build presentation object
    const id = crypto.randomUUID()
    const presentation: Presentation = {
      id,
      title: formData.title,
      sourceLessonPreserved: true,
      audience: formData.audience,
      tone: formData.tone,
      designPlot: formData.designPlot,
      slideCount: designedSlides.length,
      outputStyle: formData.outputStyle,
      slides: designedSlides,
      createdAt: new Date().toISOString(),
    }

    // Step 4: Generate export files
    const slidesJson = generateSlidesJson(presentation)
    const outlineMd = generateOutlineMd(presentation)
    const slidesMd = generateSlidesMd(presentation)
    const designNotesMd = generateDesignNotesMd(presentation)

    // Step 5: Save to disk
    savePresentation(presentation, { slidesJson, outlineMd, slidesMd, designNotesMd })

    const response: CreatePresentationResponse = {
      id,
      slideCount: presentation.slideCount,
      title: presentation.title,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('[POST /api/presentations] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    )
  }
}
