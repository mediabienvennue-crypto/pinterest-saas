import { createServerClient } from '@/lib/supabase'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Dynamic planner pages from Supabase
  let plannerPages = []
  try {
    const supabase = createServerClient()
    const { data: planners } = await supabase
      .from('planners')
      .select('slug, updated_at')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (planners) {
      plannerPages = planners.map((p) => ({
        url: `${baseUrl}/planners/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      }))
    }
  } catch (err) {
    console.error('Sitemap error:', err)
  }

  return [...staticPages, ...plannerPages]
}
