'use client'

const AD_CONFIGS = {
  leaderboard: {
    label: 'Advertisement',
    width: 'w-full max-w-4xl',
    height: 'h-[90px]',
    text: '728×90 Leaderboard Banner',
  },
  sidebar: {
    label: 'Sponsored',
    width: 'w-full',
    height: 'h-[250px]',
    text: '300×250 Medium Rectangle',
  },
  rectangle: {
    label: 'Advertisement',
    width: 'w-full max-w-2xl',
    height: 'h-[280px]',
    text: '336×280 Large Rectangle',
  },
}

export default function AdBanner({ type = 'leaderboard' }) {
  const config = AD_CONFIGS[type] || AD_CONFIGS.leaderboard

  return (
    <div className={`flex flex-col items-center mx-auto px-4 py-3 ${type === 'sidebar' ? '' : 'max-w-5xl'}`}>
      <span className="text-xs text-slate-600 uppercase tracking-widest mb-1 font-medium">
        {config.label}
      </span>
      <div
        className={`
          ${config.width} ${config.height}
          ad-skeleton rounded-xl
          border border-dashed border-slate-700/50
          flex items-center justify-center
          relative overflow-hidden
        `}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
        
        <div className="text-center z-10">
          <div className="text-slate-700 text-xs font-mono mb-1">{config.text}</div>
          <div className="text-slate-800 text-xs">Ad Placeholder · Replace with Google AdSense</div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-700" />
      </div>
    </div>
  )
}
