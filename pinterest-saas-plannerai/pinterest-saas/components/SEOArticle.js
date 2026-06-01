'use client'

// Simple markdown-to-HTML renderer for the SEO article
function parseMarkdown(md) {
  if (!md) return ''
  
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])(.+)$/gm, (line) => {
      if (line.trim() && !line.startsWith('<')) return `<p>${line}</p>`
      return line
    })
}

export default function SEOArticle({ content, title }) {
  if (!content) return null

  const htmlContent = parseMarkdown(content)

  return (
    <article className="mt-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full" />
        <div>
          <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">Full Guide</div>
          <h2
            className="text-lg font-bold text-slate-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
        </div>
        <div className="ml-auto text-xs text-slate-700 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
          ~500 words
        </div>
      </div>

      <div
        className="seo-prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs text-slate-600">Generated &amp; fact-checked by PlannerAI</span>
      </div>
    </article>
  )
}
