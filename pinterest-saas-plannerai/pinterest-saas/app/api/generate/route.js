import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import slugify from 'slugify'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
  "seoArticle": "FULL 500+ word SEO article in markdown format with proper H2 and H3 tags, written for humans, optimized for Google. Include: introduction paragraph, 2-3 H2 sections each with 1-2 H3 subsections, practical tips, and a conclusion. Use the keyword '${sanitizedTopic} planner' naturally throughout.",
  "metaDescription": "SEO meta description under 160 characters",
  "howToSteps": [
    { "name": "Step name", "text": "Step description" }
  ]
}

Requirements:
- sections: 3-5 sections, each with 3-6 checklist items
- tips: exactly 3 pro tips
- howToSteps: 4-6 steps derived from the checklist
- Make content highly actionable, specific, and valuable
- The seoArticle must be genuine quality content, not filler`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    })

    const rawContent = completion.choices[0].message.content
    let plannerData

    try {
      plannerData = JSON.parse(rawContent)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    // Generate slug
    const slug = slugify(plannerData.title || sanitizedTopic, {
      lower: true,
      strict: true,
      trim: true,
    }).slice(0, 80) + '-' + Date.now().toString(36)

    // Save to Supabase
    try {
      const supabase = createServerClient()
      const { error } = await supabase.from('planners').insert({
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
        view_count: 0,
        share_count: 0,
      })
      if (error) console.error('Supabase insert error:', error)
    } catch (dbError) {
      console.error('DB error (non-fatal):', dbError)
      // Continue even if DB save fails — don't block the user
    }

    return NextResponse.json({
      success: true,
      slug,
      planner: plannerData,
    })
  } catch (error) {
    console.error('Generate API error:', error)
    
    if (error?.status === 429) {
      return NextResponse.json({ error: 'AI is busy. Please try again in a moment.' }, { status: 429 })
    }

    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
