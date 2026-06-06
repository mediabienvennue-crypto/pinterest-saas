import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import slugify from 'slugify'
export const maxDuration = 60
if (!process.env.GROQ_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variables')
}

export async function POST(request) {
  try {
    const { topic } = await request.json()

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json({ error: 'Topic is required (min 3 characters)' }, { status: 400 })
    }

    const sanitizedTopic = topic.trim().slice(0, 120)

    const unsplashKeyword = encodeURIComponent(`artificial intelligence ${sanitizedTopic}`)
    const unsplashKeyword2 = encodeURIComponent(`AI technology productivity`)
    const unsplashKeyword3 = encodeURIComponent(`future technology planning`)

    const heroImage = `https://source.unsplash.com/1200x630/?${unsplashKeyword}`
    const sectionImage1 = `https://source.unsplash.com/800x450/?${unsplashKeyword2}`
    const sectionImage2 = `https://source.unsplash.com/800x450/?${unsplashKeyword3}`

    const systemPrompt = `You are a world-class SEO content writer and AI productivity expert.
Your ONLY specialty is: "How Artificial Intelligence tools help people plan, organize, and automate their personal and professional life."
Every piece of content you create MUST:
- Connect the user's topic to AI-powered planning tools and strategies
- Be written in fluent, engaging, human-like English
- Be 100% unique, informative, and deeply researched
- Include specific statistics, facts, and real AI tool names
- Be optimized for Google search ranking
You MUST respond with ONLY valid JSON. No markdown, no explanation, no code fences. Pure JSON object only.`

    const userPrompt = `The user searched for: "${sanitizedTopic}"

Reframe this topic through the lens of AI-powered planning and productivity.

Examples of reframing:
- "Home cleaning" → "How to Use AI to Create a Smart Home Cleaning Schedule"
- "Wedding planning" → "AI-Powered Wedding Planning: The Complete Guide"
- "Fitness routine" → "Build Your Perfect Fitness Plan Using AI Coaches"
- "Starting a business" → "How AI Planning Tools Help You Launch a Business Faster"

Now create a PREMIUM, deeply informative article for: "${sanitizedTopic}"

STRICT REQUIREMENTS for seoArticle:
- Total length: 1500 to 2500 words MINIMUM
- Must have 1 main H1 title
- Must have at least 6 H2 sections
- Each H2 section must have 2-3 H3 subsections
- Must include real statistics (e.g. "According to McKinsey 2024, AI increases productivity by 40%")
- Must mention at least 8 specific AI tools by name (ChatGPT, Claude, Notion AI, Copilot, Jasper, ClickUp AI, Motion, Reclaim.ai, etc.)
- Must include a comparison table in markdown format
- Must include a FAQ section with 5 questions and detailed answers
- Must include a "Key Takeaways" section at the end
- Must include these image placeholders exactly where relevant:
  ![AI Planning Hero](${heroImage})
  ![AI Tools Overview](${sectionImage1})
  ![AI Productivity Statistics](${sectionImage2})
- Every section must be packed with actionable advice, not generic filler
- Use power words: "proven", "essential", "breakthrough", "data-driven", "game-changing"
- Naturally include long-tail keywords like: "best AI tools for [topic]", "how to use AI for [topic]", "AI-powered [topic] strategies"

Return ONLY this exact JSON structure:
{
  "title": "How to Use AI to Plan [Topic]: The Ultimate 2025 Guide",
  "subtitle": "Discover AI-powered strategies and tools to master [topic] faster and smarter",
  "emoji": "single relevant emoji",
  "heroImage": "${heroImage}",
  "sections": [
    {
      "heading": "Section heading related to AI planning",
      "items": [
        { "text": "Highly specific actionable checklist item with AI tool mention", "priority": "high|medium|low" },
        { "text": "Another specific AI-focused actionable item", "priority": "high|medium|low" },
        { "text": "Third specific item with measurable outcome", "priority": "high|medium|low" }
      ]
    }
  ],
  "tips": [
    "Specific pro tip with AI tool name and expected result",
    "Specific pro tip about automating this with AI and time saved",
    "Specific pro tip with step-by-step mini instruction",
    "Specific pro tip with statistics or data",
    "Specific pro tip about advanced AI strategy"
  ],
  "timeEstimate": "e.g. 2-3 hours",
  "difficulty": "Beginner|Intermediate|Advanced",
  "tags": ["AI planning", "artificial intelligence", "AI tools", "productivity AI", "best AI tools 2025", "AI automation", "relevant specific tag"],
  "seoArticle": "YOUR FULL 1500-2500 WORD ARTICLE IN MARKDOWN FORMAT HERE — with H1, H2, H3, tables, FAQ, images, statistics, tool names, and Key Takeaways",
  "metaDescription": "SEO meta description under 160 characters mentioning AI, planning, and the topic with a call to action",
  "howToSteps": [
    { "name": "Step 1: Audit Your Current Process with AI", "text": "Detailed step description with specific AI tool and exact action" },
    { "name": "Step 2: Choose the Right AI Planning Tool", "text": "Detailed step with comparison criteria and tool recommendations" },
    { "name": "Step 3: Set Up Your AI-Powered Workflow", "text": "Detailed step with exact setup instructions" },
    { "name": "Step 4: Automate and Optimize", "text": "Detailed step about automation and measuring results" },
    { "name": "Step 5: Scale and Improve", "text": "Detailed step about scaling the AI strategy" }
  ]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        temperature: 0.75,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      return NextResponse.json({ error: 'No response from Groq' }, { status: 500 })
    }

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plannerData = JSON.parse(cleanText)

    plannerData.heroImage = plannerData.heroImage || heroImage
    plannerData.sectionImage1 = sectionImage1
    plannerData.sectionImage2 = sectionImage2

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
        hero_image: plannerData.heroImage,
        section_image1: sectionImage1,
        section_image2: sectionImage2,
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

    return NextResponse.json({ success: true, slug: saved.slug, planner: plannerData })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
