import PlannerGenerator from '@/components/PlannerGenerator'
import AdBanner from '@/components/AdBanner'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Top Leaderboard Ad */}
      <AdBanner type="leaderboard" />

      {/* Hero Header */}
      <header className="relative py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6 text-sm text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span>Free · No Sign-up Required · Instant AI Generation</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 glow-text"
            style={{ fontFamily: 'var(--font-display)', color: '#f1f5f9' }}
          >
            AI Planner &amp; Checklist
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Type any topic — get a complete, printable planner with checklists, action steps,
            and a full SEO guide. Share to Pinterest for bonus credits.
          </p>
        </div>
      </header>

      {/* Main Generator Tool */}
      <PlannerGenerator />
    </main>
  )
}
