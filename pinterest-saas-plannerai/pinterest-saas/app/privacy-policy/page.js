export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[#c5c6c7]">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: June 5, 2026</p>
        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p class="mb-4 leading-relaxed">At YouPlanAI, we do not require user registration. We collect the prompts you input to generate planners and your email address only if you voluntarily subscribe to receive the printable PDF version of your checklist.</p>
        </section>
        <section className="mb-8">
            <h2 class="text-2xl font-semibold text-white mb-4">2. Google AdSense & Third-Party Cookies</h2>
            <p class="mb-4 leading-relaxed">We use Google AdSense to serve advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads based on your visit to YouPlanAI. Users may opt out of personalized advertising by visiting Google Ad Settings.</p>
        </section>
        <footer className="border-t border-gray-800 pt-6 mt-12 text-center text-sm">
            <p>Contact us at: <span className="text-purple-400">support@youplanai.com</span></p>
        </footer>
    </div>
  );
}
