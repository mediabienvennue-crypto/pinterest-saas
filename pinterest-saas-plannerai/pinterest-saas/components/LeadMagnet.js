'use client'

import { useState } from 'react'

export default function LeadMagnet({ plannerSlug, plannerTitle }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')

    try {
      const res = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plannerSlug, plannerTitle }),
      })

      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-0.5">You're on the list! 🎉</h4>
            <p className="text-slate-400 text-sm">Check your inbox — the printable PDF planner is on its way.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-0.5 flex items-center gap-2">
            Email this Planner to my Inbox
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
              FREE PDF
            </span>
          </h4>
          <p className="text-slate-400 text-sm">
            Get the printable PDF version of this planner sent directly to your inbox.
            No spam, ever.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="
            flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3
            text-white placeholder-slate-500 text-sm
            focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
            transition-all duration-200
          "
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary px-5 py-3 rounded-xl font-semibold text-white text-sm whitespace-nowrap flex items-center gap-2 disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send PDF
            </>
          )}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
      )}

      <p className="text-slate-600 text-xs mt-3">
        🔒 We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  )
}
