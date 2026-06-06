import { createServerClient } from '@/lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://youplanai.com'
  
  const supabase = createServerClient()
  const { data: planners } = await supabase
    .from('planners')
    .select('slug, created_at')
    .order('created_at', { ascending: false })

  const plannerUrls = (planners || []).map((planner) => ({
    url: `${baseUrl}/planners/${planner.slug}`,
    lastModified: planner.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...plannerUrls,
  ]
}
