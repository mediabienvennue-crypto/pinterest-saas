'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getCredits, useCredit, addBonusCredits, hasShareBonus } from '@/lib/credits'
import UnlockModal from './UnlockModal'
import ChecklistDisplay from './ChecklistDisplay'
import SEOArticle from './SEOArticle'
import ShareButtons from './ShareButtons'
import LeadMagnet from './LeadMagnet'
import AdBanner from './AdBanner'

const EXAMPLE_TOPICS = [
  'Morning Routine for Productivity',
  'Starting a Small Business',
  '30-Day Fitness Challenge',
  'Home Organization Deep Clean',
  'Learning a New Language',
  'Meal Prep for the Week',
  'Starting a YouTube Channel',
  'Planning a Wedding',
]

export default function PlannerGenerator() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [credits, setCredits] = useState(2)
  const [showModal, setShowModal] = useState(false)
  const [modalCreditsAdded, setModalCreditsAdded] = useState(false)
  const [shareBonus, setShareBonus] = useState(false)
  const [currentSlug, setCurrentSlug] = useState(null)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setCredits(getCredits())
    setShareBonus(hasShareBonus())
    setBaseUrl(window.location.origin)
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    if (isGenerating) return

    const canUse = useCredit()
    if (!canUse) {
      setShowModal(true)
      setModalCreditsAdded(false)
      return
    }

    setCredits(getCredits())
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      setResult(data.planner)
      setCurrentSlug(data.slug)
      
      // Update URL without reload for SEO
      if (data.slug) {
        window.history.pushState({}, '', `/planners/${data.slug}`)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      // Refund credit on error
      const stored = localStorage.getItem('planner_credits')
      if (stored) {
        const d = JSON.parse(stored)
        d.used = Math.max(0, (d.used || 1) - 1)
        localStorage.setItem('planner_credits', JSON.stringify(d))
        setCredits(getCredits())
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreditsAdded = (newCredits) => {
    setCredits(newCredits)
    setShareBonus(true)
    setModalCreditsAdded(true)
    if (showModal) {
      setTimeout(() => setShowModal(false), 2000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const creditColor = credits === 0 ? 'text-red-400' : credits === 1 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* Generator Card */}
      <div className="glass-card rounded-2xl p-6 mb-6 neon-border">
        {/* Topic Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-400 mb-2 block">
            What do you want to plan?
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Morning Routine, Starting a Business, 30-Day Fitness Plan..."
              maxLength={120}
              className="
                w-full bg-slate-900/80 border border-slate-700 rounded-xl
                px-4 py-4 pr-32 text-white placeholder-slate-600
                focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                transition-all duration-200 text-base
              "
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="
                absolute right-2 top-2 bottom-2
                btn-primary px-5 rounded-lg font-semibold text-sm text-white
                flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                disabled:transform-none
              "
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLE_TOPICS.slice(0, 4).map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="text-xs px-3 py-1.5 bg-slate-800/60 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/40 rounded-lg text-slate-400 hover:text-purple-300 transition-all duration-150"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Credits + status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-1.5 font-medium ${creditColor}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"/>
              </svg>
              <span>{credits} credit{credits !== 1 ? 's' : ''} remaining</span>
            </div>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600 text-xs">Resets daily</span>
          </div>

          {credits < 2 && (
            <button
              onClick={() => { setShowModal(true); setModalCreditsAdded(false) }}
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2"
            >
              Get more credits →
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-4 mb-6 border border-red-800/40 bg-red-900/10 animate-fade-in">
          <div className="flex items-center gap-2 text-red-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isGenerating && (
        <div className="glass-card rounded-2xl p-6 mb-6 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-2/3 mb-4" />
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-800 rounded flex-shrink-0" />
                <div className={`h-4 bg-slate-800 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-5/6'}`} />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-800 rounded w-4/5" />
            <div className="h-4 bg-slate-800 rounded w-full" />
          </div>
          <div className="mt-3 text-center text-xs text-slate-600">
            ✨ AI is crafting your planner...
          </div>
        </div>
      )}

      {/* Generated Result */}
      {result && !isGenerating && (
        <div className="animate-slide-up">
          {/* Result header */}
          <div className="glass-card rounded-2xl p-6 mb-4">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {result.emoji} {result.title}
                </h2>
                <p className="text-slate-400 text-sm">{result.subtitle}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 font-medium">
                  ✓ Generated
                </span>
              </div>
            </div>

            {/* Tags */}
            {result.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-slate-800/80 text-slate-400 rounded-full border border-slate-700/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Two-column layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main checklist - 2/3 */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 mb-4">
                <ChecklistDisplay
                  sections={result.sections}
                  tips={result.tips}
                  timeEstimate={result.timeEstimate}
                  difficulty={result.difficulty}
                  emoji={result.emoji}
                />
              </div>

              {/* Lead Magnet */}
              <div className="mb-4">
                <LeadMagnet plannerSlug={currentSlug} plannerTitle={result.title} />
              </div>
            </div>

            {/* Sidebar - 1/3 */}
            <div className="lg:col-span-1 space-y-4">
              {/* Share box */}
              <div className="glass-card rounded-2xl p-5">
                <ShareButtons
                  title={result.title}
                  slug={currentSlug}
                  baseUrl={baseUrl}
                  onCreditsAdded={handleCreditsAdded}
                  hasShareBonus={shareBonus}
                />
              </div>

              {/* Sidebar Ad */}
              <AdBanner type="sidebar" />

              {/* Quick stats */}
              <div className="glass-card rounded-2xl p-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Planner Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total tasks</span>
                    <span className="text-slate-300 font-medium">
                      {result.sections?.reduce((a, s) => a + (s.items?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sections</span>
                    <span className="text-slate-300 font-medium">{result.sections?.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Difficulty</span>
                    <span className="text-slate-300 font-medium">{result.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. time</span>
                    <span className="text-slate-300 font-medium">{result.timeEstimate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rectangle Ad between tool and article */}
          <div className="flex justify-center my-6">
            <AdBanner type="rectangle" />
          </div>

          {/* SEO Article */}
          <div className="glass-card rounded-2xl p-6">
            <SEOArticle content={result.seoArticle} title={result.title} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !isGenerating && !error && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to generate your planner
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Type any topic above and hit Generate. Get a full checklist, action steps, pro tips, and a printable PDF guide — all in seconds.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_TOPICS.slice(4).map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="text-sm px-4 py-2 bg-slate-800/60 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/40 rounded-xl text-slate-400 hover:text-purple-300 transition-all duration-150"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unlock Modal */}
      {showModal && (
        <UnlockModal
          onClose={() => setShowModal(false)}
          onShare={handleCreditsAdded}
          creditsAdded={modalCreditsAdded}
        />
      )}
    </div>
  )
}
