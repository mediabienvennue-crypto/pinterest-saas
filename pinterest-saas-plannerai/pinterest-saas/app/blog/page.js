export default function BlogIndex() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-[#c5c6c7]">
        <h1 className="text-4xl font-bold text-white mb-2">AI Planners Hub</h1>
        <p className="text-gray-400 mb-12">Explore hyper-optimized strategies generated and cross-referenced by YouPlanAI engines.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-[#1f2833] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 p-6">
                <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">Logistics</span>
                <h2 className="text-xl font-bold text-white mt-2 mb-3">
                  <a href="/planners/ultimate-emergency-moving-planner-and-checklist" className="hover:text-purple-400 transition">Ultimate Emergency Moving Planner & Checklist</a>
                </h2>
                <p className="text-sm text-gray-400 mb-4">How to pack, secure utilities, and relocate a 3-bedroom estate under a strict 48-hour deadline constraint.</p>
                <a href="/planners/ultimate-emergency-moving-planner-and-checklist" className="text-sm text-white font-semibold inline-flex items-center hover:underline">View Guide &rarr;</a>
            </article>
        </div>
    </div>
  );
}
