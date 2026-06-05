export default function ContactUs() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-[#c5c6c7]">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 text-center mb-4">Contact Support</h1>
        <p className="text-center text-slate-400 mb-12">Have a business inquiry, technical issue, or feedback? Drop us a message below.</p>
        <form action="#" method="POST" className="space-y-6 mt-8">
            <div>
                <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                <input type="email" required className="w-full bg-[#1f2833] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                <input type="text" required className="w-full bg-[#1f2833] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-white mb-2">Message</label>
                <textarea rows="5" required className="w-full bg-[#1f2833] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition">Send Message</button>
        </form>
    </div>
  );
}
