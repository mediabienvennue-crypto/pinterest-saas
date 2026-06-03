import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import slugify from 'slugify'

if (!process.env.GEMINI_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variables')
}

export async function POST(request) {
  try {
    const { topic } = await request.json()

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json({ error: 'Topic is required (min 3 characters)' }, { status: 400 })
    }

    const sanitizedTopic = topic.trim().slice(0, 120)

    const systemPrompt = `You are an expert content strategist and productivity planner.
You MUST respond with ONLY valid JSON. No markdown, no explanation, no code fences.
Pure JSON object only.`

    const userPrompt = `Create a comprehensive planner and SEO guide for the topic: "${sanitizedTopic}"

Return ONLY this exact JSON structure (no markdown, no extra text):
{
  "title": "Ultimate [Topic] Planner & Checklist",
  "subtitle": "A short compelling subtitle (under 15 words)",
  "emoji": "single relevant emoji",
  "sections": [
    {
      "heading": "Section heading (e.g. 'Getting Started')",
      "items": [
        { "text": "Actionable checklist item", "priority": "high|medium|low" },
        { "text": "Another actionable item", "priority": "high|medium|low" }
      ]
    }
  ],
  "tips": ["Pro tip 1", "Pro tip 2", "Pro tip 3"],
  "timeEstimate": "e.g. 2-3 hours",
  "difficulty": "Beginner|Intermediate|Advanced",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "seoArticle": "Full 500+ word SEO article in markdown format with proper H2 and H3 tags",
  "metaDescription": "SEO meta description under 160 characters",
  "howToSteps": [
    { "name": "Step name", "text": "Step description" }
  ]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
        })
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 })
    }

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plannerData = JSON.parse(cleanText)

    const supabase = createServerClient()
    const slug = slugify(plannerData.title || sanitizedTopic, { lower: true, strict: true })

    const { data: saved, error: dbError } = await supabase
      .from('planners')
      .insert({
        slug,
        topic: sanitizedTopic,
        title: plannerData.title,
        subtitle: plannerData.subtitle,
        emoji: plannerData.emoji,
        sections: plannerData.sections,
        tips: plannerData.tips,
        time_estimate: plannerData.timeEstimate,
        difficulty: plannerData.difficulty,
        tags: plannerData.tags,
        seo_article: plannerData.seoArticle,
        meta_description: plannerData.metaDescription,
        how_to_steps: plannerData.howToSteps,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB Error:', dbError)
      return NextResponse.json({ error: 'Failed to save planner' }, { status: 500 })
    }

    return NextResponse.json({ slug: saved.slug, data: plannerData })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
