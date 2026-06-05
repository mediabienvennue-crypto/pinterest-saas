import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import PlannerView from '@/components/PlannerView'
import AdBanner from '@/components/AdBanner'

export async function generateMetadata({ params }) {
  const { slug } = params
  
  try {
    const supabase = createServerClient()
    const { data: planner } = await supabase
      .from('planners')
      .select('title, meta_description, tags, emoji, difficulty')
      .eq('slug', slug)
      .single()

    if (!planner) return { title: 'Planner Not Found' }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youplanai.com'
    const ogImageUrl = `${baseUrl}/api/og-image?title=${encodeURIComponent(planner.title)}&emoji=${encodeURIComponent(planner.emoji || '✨')}&tags=${encodeURIComponent((planner.tags || []).join(','))}&difficulty=${encodeURIComponent(planner.difficulty || 'Beginner')}`

    return {
      title: `${planner.title} | YouPlanAI`,
      description: planner.meta_description,
      keywords: (planner.tags || []).join(', '),
      openGraph: {
        title: planner.title,
        description: planner.meta_description,
        type: 'article',
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: planner.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: planner.title,
        description: planner.meta_description,
        images: [ogImageUrl],
      },
    }
  } catch {
    return { title: 'YouPlanAI' }
  }
}

export default async function PlannerPage({ params }) {
  const { slug } = params

  let planner = null
  try {
    const supabase = createServerClient()
    
    // Increment view count and fetch
    const { data } = await supabase
      .from('planners')
      .select('*')
      .eq('slug', slug)
      .single()

    planner = data

    if (planner) {
      // Async view count increment (fire and forget)
      supabase
        .from('planners')
        .update({ view_count: (planner.view_count || 0) + 1 })
        .eq('slug', slug)
        .then(() => {})
    }
  } catch (err) {
    console.error('Planner fetch error:', err)
  }

  if (!planner) return notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youplanai.com'

  // Build JSON-LD structured data
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: planner.title,
    description: planner.meta_description,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    totalTime: `PT${planner.time_estimate?.replace(/\D+/g, '') || '2'}H`,
    step: (planner.how_to_steps || []).map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: [],
    supply: [],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: planner.title,
    description: planner.meta_description,
    datePublished: planner.created_at,
    dateModified: planner.created_at,
    author: { '@type': 'Organization', name: 'YouPlanAI' },
    publisher: {
      '@type': 'Organization',
      name: 'YouPlanAI',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    image: `${baseUrl}/api/og-image?title=${encodeURIComponent(planner.title)}`,
    keywords: (planner.tags || []).join(', '),
  }

  return (
    <>
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen">
        <AdBanner type="leaderboard" />
        <PlannerView planner={planner} slug={slug} baseUrl={baseUrl} />
      </main>
    </>
  )
}
