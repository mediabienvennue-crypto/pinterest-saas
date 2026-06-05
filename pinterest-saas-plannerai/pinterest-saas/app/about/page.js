export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center text-[#c5c6c7]">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-6">Our Mission</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed mb-12">Democratizing operational intelligence. YouPlanAI converts complex concepts into hyper-structured, actionable execution blueprints instantly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            <div className="p-6 bg-[#1f2833] rounded-xl border border-purple-500/10">
                <h3 className="text-lg font-bold text-white mb-2">Instant Generation</h3>
                <p className="text-sm text-gray-400">Zero frictionless signups. Input a topic, extract structured planning vectors immediately.</p>
            </div>
            <div className="p-6 bg-[#1f2833] rounded-xl border border-purple-500/10">
                <h3 className="text-lg font-bold text-white mb-2">SEO Blueprinting</h3>
                <p class="text-sm text-gray-400">Every plan injects comprehensive semantic data optimized for absolute visibility across digital channels.</p>
            </div>
            <div className="p-6 bg-[#1f2833] rounded-xl border border-purple-500/10">
                <h3 className="text-lg font-bold text-white mb-2">Printable Architecture</h3>
                <p class="text-sm text-gray-400">Seamlessly exported components optimized for workspace applications like Notion, Sheets, or physical printables.</p>
            </div>
        </div>
    </div>
  );
}
