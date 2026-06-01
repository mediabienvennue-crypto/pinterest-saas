'use client'

import { useState } from 'react'

export default function UnlockModal({ onClose, onShare, creditsAdded }) {
  const [sharing, setSharing] = useState(null)
  const [shared, setShared] = useState([])

  const handleShare = async (platform) => {
    setSharing(platform)
    const url = typeof window !== 'undefined' ? window.location.href : 'https://plannerai.app'
    const text = '🎯 Just generated an amazing planner with PlannerAI! Try it free →'

    if (platform === 'pinterest') {
      window.open(
        `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
        '_blank',
        'width=750,height=550'
      )
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank',
        'width=550,height=420'
      )
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url)
      } catch {}
    }

    setTimeout(() => {
      setSharing(null)
      setShared(prev => [...prev, platform])
      onShare(platform)
    }, 800)
  }

  const shareButtons = [
    {
      id: 'pinterest',
      label: 'Pin on Pinterest',
      sublabel: '+3 credits',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
      color: 'bg-red-600 hover:bg-red-500',
      done: 'bg-red-800',
    },
    {
      id: 'twitter',
      label: 'Share on X',
      sublabel: '+3 credits',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-slate-800 hover:bg-slate-700 border border-slate-600',
      done: 'bg-slate-900',
    },
    {
      id: 'copy',
      label: 'Copy Link',
      sublabel: '+3 credits',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-700 hover:bg-purple-600',
      done: 'bg-purple-900',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black/70 animate-fade-in px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full neon-border animate-slide-up">
        {creditsAdded ? (
          // Success state
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              +3 Credits Unlocked! 🎉
            </h3>
            <p className="text-slate-400 mb-6">You've earned 3 bonus generations. Keep creating!</p>
            <button
              onClick={onClose}
              className="btn-primary w-full py-3 px-6 rounded-xl font-semibold text-white"
            >
              Continue Generating
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4 text-xs text-amber-300 font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Daily limit reached
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Unlock More Generations
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Share PlannerAI to earn <span className="text-purple-300 font-semibold">+3 free credits instantly</span> — no signup needed.
              </p>
            </div>

            {/* Share buttons */}
            <div className="space-y-3 mb-6">
              {shareButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => !shared.includes(btn.id) && handleShare(btn.id)}
                  disabled={sharing === btn.id || shared.includes(btn.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                    font-medium text-white transition-all duration-200 text-sm
                    ${shared.includes(btn.id) ? btn.done + ' opacity-60' : btn.color}
                    ${sharing === btn.id ? 'opacity-70 scale-98' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {sharing === btn.id ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : shared.includes(btn.id) ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : btn.icon}
                    <span>{shared.includes(btn.id) ? 'Shared! Credits added ✓' : btn.label}</span>
                  </div>
                  {!shared.includes(btn.id) && (
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{btn.sublabel}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-600 text-xs">or</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Pro upsell */}
            <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Pro Access</div>
              <div className="text-white font-semibold mb-1">Unlimited Generations</div>
              <div className="text-slate-400 text-xs mb-3">+ PDF export, no watermarks, priority AI</div>
              <div className="text-purple-300 font-bold text-lg">Coming Soon — Join Waitlist</div>
            </div>

            <button onClick={onClose} className="w-full mt-4 text-slate-600 text-sm hover:text-slate-400 transition-colors">
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  )
}
