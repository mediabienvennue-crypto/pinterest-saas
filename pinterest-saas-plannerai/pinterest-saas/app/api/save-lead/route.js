import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email, plannerSlug, plannerTitle } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Upsert to avoid duplicate emails for same planner
    const { error } = await supabase.from('leads').upsert(
      {
        email: email.toLowerCase().trim(),
        planner_slug: plannerSlug || null,
        planner_title: plannerTitle || null,
        source: 'email_planner_magnet',
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'email,planner_slug',
        ignoreDuplicates: true,
      }
    )

    if (error) {
      console.error('Lead save error:', error)
      // Don't expose DB errors to client
      return NextResponse.json({ success: true }) // Still show success to user
    }

    return NextResponse.json({ success: true, message: 'Check your inbox! PDF is on its way.' })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json({ success: true }) // Graceful degradation
  }
}
