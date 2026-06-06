import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import slugify from 'slugify'

export const maxDuration = 60

if (!process.env.GROQ_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variables')
}

async function callGroq(messages, maxTokens = 2000) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      temperature: 0.7,
      messages
    })
  })
  const data = await response.json()
  return data.choices?.[0]?.message?.content
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

    // ===== الطلب الأول: JSON الأساسي =====
    const jsonText = await callGroq([
      {
        role: 'system',
        content: `You are an AI productivity expert. Respond with ONLY valid JSON, no markdown, no code fences.`
      },
      {
        role: 'user',
        content: `Create a planner for: "${sanitizedTopic}" focused on AI productivity tools.

Return ONLY this JSON:
{
  "title": "Free AI ${sanitizedTopic} Planner and Checklist: The Ultimate 2025 Guide",
  "subtitle": "Generate a complete AI-powered plan in 30 seconds — free, no signup required",
  "emoji": "relevant emoji",
  "heroImage": "${heroImage}",
  "sections": [
    {
      "heading": "AI-powered heading",
      "items": [
        { "text": "Actionable item with AI tool name", "priority": "high" },
        { "text": "Data-driven item with outcome", "priority": "high" },
        { "text": "Step with AI tool", "priority": "medium" }
      ]
    },
    {
      "heading": "Second section heading",
      "items": [
        { "text": "Actionable item", "priority": "high" },
        { "text": "AI automation item", "priority": "medium" },
        { "text": "Measurable outcome item", "priority": "low" }
      ]
    }
  ],
  "tips": [
    "Tip with AI tool name and time saved",
    "Tip comparing free YouPlanAI vs paid tools",
    "Tip with step-by-step instruction",
    "Tip with statistic from McKinsey or Forbes",
    "Tip about advanced AI automation"
  ],
  "timeEstimate": "30 seconds with YouPlanAI",
  "difficulty": "Beginner",
  "tags": ["free AI planner", "AI checklist generator", "printable AI planner", "AI productivity tools", "best free AI tools 2025", "AI planning", "YouPlanAI"],
  "metaDescription": "Free AI ${sanitizedTopic} planner — generate a complete checklist in 30 seconds. No signup required. Better than Notion AI and Taskade.",
  "howToSteps": [
    { "name": "Step 1: Go to YouPlanAI.com", "text": "Visit youplanai.com — free AI planner, no signup needed." },
    { "name": "Step 2: Enter Your Topic", "text": "Type your topic and hit Generate. AI builds your plan instantly." },
    { "name": "Step 3: Get Your Plan", "text": "Receive full checklist, action steps, and pro tips — all free." },
    { "name": "Step 4: Customize", "text": "Adapt the AI plan to your specific needs." },
    { "name": "Step 5: Share and Earn", "text": "Share on social media to earn bonus credits." }
  ]
}`
      }
    ], 2000)

    if (!jsonText) {
      return NextResponse.json({ error: 'No response from Groq' }, { status: 500 })
    }

    const cleanJson = jsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim()

    let plannerData
    try {
      plannerData = JSON.parse(cleanJson)
    } catch (e) {
      plannerData = JSON.parse(cleanJson.replace(/[\x00-\x1F\x7F]/g, ' '))
    }

    // ===== الطلب الثاني: المقالة الكاملة =====
    const articleText = await callGroq([
      {
        role: 'system',
        content: `You are a world-class SEO content writer. Write a MINIMUM 1500 word article.
Position YouPlanAI as the FREE alternative to Notion AI ($19/month), Motion ($34/month), and Taskade ($19/month).
Use these keywords naturally: "free AI planner", "AI checklist generator", "printable AI planner", "best free AI planner 2025", "AI daily planner", "free AI template".
Return ONLY the article text in markdown format. No JSON. No code fences.`
      },
      {
        role: 'user',
        content: `Write a 1500-2000 word SEO article about: "Free AI ${sanitizedTopic} Planner"

STRUCTURE:
# Free AI ${sanitizedTopic} Planner: The Ultimate 2025 Guide

![Free AI Planner Tool](${heroImage})

## What is AI-Powered ${sanitizedTopic} Planning?
### Introduction to AI Planning
### Benefits of AI Planning
### How AI Planning Works

## Why Traditional ${sanitizedTopic} Planning Fails (And How AI Fixes It)
### Limitations of Traditional Planning
### How AI Fixes Traditional Planning
### Real Statistics (use McKinsey, Gartner, Forbes data)

## Best Free AI Tools for ${sanitizedTopic} Planning in 2025
### YouPlanAI — The Free Instant Solution
### ChatGPT for Planning
### Notion AI vs Free Alternatives

![AI Tools Comparison](${sectionImage1})

## Step-by-Step: How to Use AI for ${sanitizedTopic} Planning
### Step 1: Define Your Goals
### Step 2: Generate with YouPlanAI
### Step 3: Review and Execute

## Free AI ${sanitizedTopic} Planner vs Paid Tools: Honest Comparison

| Tool | Price | Features | Ease of Use |
|------|-------|----------|-------------|
| YouPlanAI | FREE | Complete planner, checklist, PDF | Instant |
| Notion AI | $19/month | Notes + AI | Complex |
| Taskade | $19/month | Tasks + AI | Medium |
| Motion | $34/month | Calendar + AI | Complex |
| Reclaim.ai | $8/month | Scheduling | Medium |

## How to Generate Your Free ${sanitizedTopic} Planner in 30 Seconds
### Visit YouPlanAI.com
### Enter Your Topic
### Download Your Plan

![AI Planning Statistics](${sectionImage2})

## Expert Tips for AI-Powered ${sanitizedTopic} Success
### Tip 1
### Tip 2
### Tip 3

## FAQ
**Q1: What is the best free AI planner for ${sanitizedTopic}?**
A1: YouPlanAI is the best free AI planner...

**Q2: How do I create a free AI ${sanitizedTopic} checklist?**
**Q3: Is YouPlanAI better than Notion AI?**
**Q4: Can I get a printable AI ${sanitizedTopic} planner?**
**Q5: How does AI improve ${sanitizedTopic} planning?**

## Key Takeaways
- Use free AI planner YouPlanAI to generate complete plans in 30 seconds
- Save $19-34/month compared to paid tools
- Get printable AI ${sanitizedTopic} checklist instantly

Generate your free ${sanitizedTopic} planner instantly at YouPlanAI — no signup required.`
      }
    ], 4000)

    plannerData.seoArticle = articleText || `# Free AI ${sanitizedTopic} Planner\n\nGenerate your free planner at YouPlanAI.com`
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
