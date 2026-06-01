import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'AI Planner Generator'
  const emoji = searchParams.get('emoji') || '✨'
  const tags = searchParams.get('tags') || 'planner,checklist,guide'
  const difficulty = searchParams.get('difficulty') || 'Beginner'

  // Generate SVG-based OG image (no canvas needed, pure SVG)
  const tagList = tags.split(',').slice(0, 3)
  
  const truncatedTitle = title.length > 50 ? title.slice(0, 47) + '...' : title
  
  // Word-wrap title for 2 lines max
  const words = truncatedTitle.split(' ')
  let line1 = ''
  let line2 = ''
  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= 28) {
      line1 = (line1 + ' ' + word).trim()
    } else {
      line2 = (line2 + ' ' + word).trim()
    }
  }

  const tagBadges = tagList.map((tag, i) => `
    <rect x="${40 + i * 130}" y="260" width="120" height="28" rx="14" fill="rgba(168,85,247,0.25)" stroke="rgba(168,85,247,0.5)" stroke-width="1"/>
    <text x="${100 + i * 130}" y="279" text-anchor="middle" font-family="system-ui" font-size="12" fill="#c4b5fd">#${tag.trim()}</text>
  `).join('')

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#07091a"/>
      <stop offset="100%" style="stop-color:#0d0a1e"/>
    </linearGradient>
    <radialGradient id="glow1" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:rgba(139,92,246,0.4)"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </radialGradient>
    <radialGradient id="glow2" cx="70%" cy="70%">
      <stop offset="0%" style="stop-color:rgba(16,185,129,0.2)"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </radialGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#c084fc"/>
      <stop offset="50%" style="stop-color:#e879f9"/>
      <stop offset="100%" style="stop-color:#818cf8"/>
    </linearGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Ambient glows -->
  <ellipse cx="360" cy="200" rx="400" ry="300" fill="url(#glow1)" filter="url(#blur1)" opacity="0.8"/>
  <ellipse cx="840" cy="430" rx="350" ry="250" fill="url(#glow2)" filter="url(#blur1)" opacity="0.8"/>
  
  <!-- Grid pattern overlay -->
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#grid)"/>
  
  <!-- Card -->
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  
  <!-- Top accent line -->
  <rect x="60" y="60" width="1080" height="3" rx="1.5" fill="url(#titleGrad)"/>
  
  <!-- Brand name -->
  <text x="100" y="130" font-family="system-ui,sans-serif" font-weight="700" font-size="18" fill="rgba(255,255,255,0.4)" letter-spacing="3">PLANNERAI</text>
  <text x="250" y="130" font-family="system-ui,sans-serif" font-size="18" fill="rgba(255,255,255,0.2)">·</text>
  <text x="265" y="130" font-family="system-ui,sans-serif" font-size="18" fill="rgba(255,255,255,0.3)">AI-Generated Guide</text>
  
  <!-- Emoji -->
  <text x="100" y="195" font-size="56">${emoji}</text>
  
  <!-- Main title -->
  <text x="100" y="245" font-family="Georgia,serif" font-weight="700" font-size="52" fill="url(#titleGrad)">${line1}</text>
  ${line2 ? `<text x="100" y="310" font-family="Georgia,serif" font-weight="700" font-size="52" fill="url(#titleGrad)">${line2}</text>` : ''}
  
  <!-- Tags -->
  ${tagBadges}
  
  <!-- Difficulty badge -->
  <rect x="860" y="400" width="160" height="32" rx="16" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" stroke-width="1"/>
  <text x="940" y="421" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="600" fill="#34d399">${difficulty}</text>
  
  <!-- Bottom CTA -->
  <text x="100" y="520" font-family="system-ui,sans-serif" font-size="20" fill="rgba(255,255,255,0.5)">Free printable planner · AI-generated · Export to PDF</text>
  
  <!-- Pinterest-style save icon area -->
  <rect x="1020" y="100" width="80" height="36" rx="18" fill="#E60023"/>
  <text x="1060" y="123" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="700" fill="white">Save</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
