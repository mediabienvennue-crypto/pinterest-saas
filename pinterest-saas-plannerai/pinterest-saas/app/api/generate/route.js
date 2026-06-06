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

    const systemPrompt = `You are a world-class SEO content writer, AI productivity expert, and Google-certified content strategist.

Your ONLY specialty is: "How Artificial Intelligence tools help people plan, organize, and automate their personal and professional life."

CORE MISSION: Position YouPlanAI (youplanai.com) as the FREE alternative to expensive tools like Notion AI, Motion, Taskade, and Reclaim.ai.

Every piece of content you create MUST:
- Target people searching for FREE AI planning tools
- Compare YouPlanAI favorably against paid competitors
- Be written in fluent, engaging, human-like English
- Be 100% unique, deeply researched, and packed with value
- Naturally include high-value SEO keywords throughout
- Be optimized to rank #1 on Google for AI planning topics

HIGH-VALUE KEYWORDS TO USE NATURALLY:
"free AI planner", "AI checklist generator", "printable AI planner",
"how to use AI for planning", "AI productivity tools free",
"free AI template", "AI daily planner", "AI weekly schedule generator",
"ChatGPT planner", "free printable AI planner", "AI goal planner",
"best free AI planner 2025", "AI planning tools", "automated planner AI"

You MUST respond with ONLY valid JSON. No markdown, no explanation, no code fences. Pure JSON object only.
CRITICAL: The seoArticle field must be minimum 1500 words. Use \\n for line breaks, never actual newlines. No tab characters. No control characters.`

    const userPrompt = `The user searched for: "${sanitizedTopic}"

YOUR MISSION: Create the BEST and most comprehensive piece of content on the internet about this topic — better than Taskade, Notion AI, SafetyCulture, and Lindy.ai combined.

Reframe this topic through AI-powered planning and position YouPlanAI as the free solution.

SKYSCRAPER TECHNIQUE — Beat competitors by:
1. Going DEEPER than anyone else on this topic
2. Including REAL statistics competitors do not mention
3. Providing ACTIONABLE steps competitors only hint at
4. Mentioning YouPlanAI as the FREE instant solution
5. Targeting long-tail keywords competitors ignore

STRICT REQUIREMENTS for seoArticle (1500-2500 words):
- H1: Must include "free AI planner" or "AI [topic] planner" naturally
- H2 sections (minimum 6):
  * "What is AI-Powered [Topic] Planning?"
  * "Why Traditional [Topic] Planning Fails (And How AI Fixes It)"
  * "Best Free AI Tools for [Topic] Planning in 2025"
  * "Step-by-Step: How to Use AI for [Topic] Planning"
  * "Free AI [Topic] Planner vs Paid Tools: Honest Comparison"
  * "How to Generate Your Free [Topic] Planner in 30 Seconds"
  * "Expert Tips for AI-Powered [Topic] Success"
- Each H2 must have 2-3 H3 subsections
- Real statistics with sources (McKinsey, Gartner, Forbes, Harvard)
- Mention 8+ AI tools: ChatGPT, Claude, YouPlanAI, Notion AI, Motion, Taskade, Reclaim.ai, ClickUp AI
- ALWAYS position YouPlanAI as: "the free, instant, no-signup alternative"
- Comparison table: YouPlanAI vs Notion AI vs Taskade vs Motion (price, features, ease)
- FAQ section: 5 questions people actually Google
- Key Takeaways section at end
- Long-tail keywords woven naturally
- Call to action: "Generate your free [topic] planner instantly at YouPlanAI — no signup required"

COMPETITOR WEAKNESS TO EXPLOIT:
- Taskade: expensive ($19/month) — YouPlanAI is FREE
- Notion AI: complex setup — YouPlanAI works in 30 seconds
- Motion: $34/month — YouPlanAI is FREE
- SafetyCulture: enterprise only — YouPlanAI is for everyone

Return ONLY this exact JSON structure with NO actual newlines inside string values:
{
  "title": "Free AI [Topic] Planner and Checklist: The Ultimate 2025 Guide",
  "subtitle": "Generate a complete AI-powered [topic] plan in 30 seconds — free, no signup required",
  "emoji": "single relevant emoji",
  "heroImage": "${heroImage}",
  "sections": [
    {
      "heading": "AI-powered section heading",
      "items": [
        { "text": "Specific actionable item mentioning free AI tool or YouPlanAI", "priority": "high" },
        { "text": "Data-driven actionable item with measurable outcome", "priority": "high" },
        { "text": "Step-by-step mini-instruction with AI tool name", "priority": "medium" }
      ]
    }
  ],
  "tips": [
    "Pro tip with specific AI tool name, exact action, and time saved",
    "Pro tip comparing free YouPlanAI vs paid alternatives with savings amount",
    "Pro tip with step-by-step instruction and expected result",
    "Pro tip with real statistic and source",
    "Pro tip about advanced AI automation strategy"
  ],
  "timeEstimate": "30 seconds with YouPlanAI",
  "difficulty": "Beginner",
  "tags": ["free AI planner", "AI checklist g
