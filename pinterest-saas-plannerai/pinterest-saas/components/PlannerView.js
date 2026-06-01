'use client'

import { useState, useEffect } from 'react'
import { hasShareBonus, addBonusCredits } from '@/lib/credits'
import ChecklistDisplay from './ChecklistDisplay'
import SEOArticle from './SEOArticle'
import ShareButtons from './ShareButtons'
import LeadMagnet from './LeadMagnet'
import AdBanner from './AdBanner'

export default function PlannerView({ planner, slug, baseUrl }) {
  const [shareBonus, setShareBonus] = useState(false)

  useEffect(() => {
    setShareBonus(hasShareBonus())
  }, [])

  const handleCreditsAdded = () => {
    setShareBonus(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-20">
      {/* Back link */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-400 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Generate another planner
      </a>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 mb-6 neon-border">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {planner.emoji} {planner.title}
            </h1>
            <p className="text-slate-400">{planner.subtitle}</p>
            {planner.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {planner.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-slate-800/80 text-slate-400 rounded-full border border-slate-700/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ml-4 text-right">
            <div className="text-xs text-slate-600 mb-1">
              {planner.view_count || 0} views
            </div>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 font-medium">
              ✓ AI-Generated
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 mb-4">
            <ChecklistDisplay
              sections={planner.sections}
              tips={planner.tips}
              timeEstimate={planner.time_estimate}
              difficulty={planner.difficulty}
              emoji={planner.emoji}
            />
          </div>
          <div className="mb-4">
            <LeadMagnet plannerSlug={slug} plannerTitle={planner.title} />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <ShareButtons
              title={planner.title}
              slug={slug}
              baseUrl={baseUrl}
              onCreditsAdded={handleCreditsAdded}
              hasShareBonus={shareBonus}
            />
          </div>
          <AdBanner type="sidebar" />
        </div>
      </div>

      <div className="flex justify-center my-6">
        <AdBanner type="rectangle" />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <SEOArticle content={planner.seo_article} title={planner.title} />
      </div>
    </div>
  )
}
