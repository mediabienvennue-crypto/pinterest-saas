import "./globals.css";

export const metadata = {
  title: "YouPlanAI - Ultimate AI Planner & Checklist Generator",
  description: "Convert complex concepts into hyper-structured, actionable execution blueprints instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0c10] text-[#c5c6c7] font-sans antialiased min-h-screen flex flex-col justify-between">
        
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* START OF YOUPLANAI PREMIUM FOOTER BLOCK */}
        <footer className="bg-[#0b0c10] border-t border-gray-800/60 py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Brand Segment */}
              <div className="flex flex-col items-center md:items-start">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 tracking-wide">YouPlanAI</span>
                  <p class="text-xs text-gray-500 mt-2">© 2026 YouPlanAI. Operational Intelligence Platform.</p>
              </div>

              {/* Structural Navigation Vector (The 5 Pages) */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-400">
                  <a href="/about" className="hover:text-purple-400 transition-colors duration-200">About Us</a>
                  <a href="/blog" className="hover:text-purple-400 transition-colors duration-200">AI Planners Hub</a>
                  <a href="/contact" className="hover:text-purple-400 transition-colors duration-200">Contact Us</a>
                  <a href="/privacy-policy" className="hover:text-purple-400 transition-colors duration-200">Privacy Policy</a>
                  <a href="/terms-conditions" className="hover:text-purple-400 transition-colors duration-200">Terms & Conditions</a>
              </div>

          </div>
        </footer>
        {/* END OF YOUPLANAI PREMIUM FOOTER BLOCK */}

      </body>
    </html>
  );
}
