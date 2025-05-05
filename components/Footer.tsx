import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 bg-black w-full">
      <div className="px-4 md:px-6 max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center mb-2">
            <span className="text-xl font-bold text-white">Routstr</span>
          </Link>
          <p className="text-xs text-gray-400">Decentralized LLM routing marketplace</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col md:flex-row items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/models" className="text-sm text-gray-400 hover:text-white transition-colors">Models</Link>
          <Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors">Chat</Link>
          <Link href="/roadmap" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</Link>
          <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
        </nav>

        {/* Connect */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Link href="https://x.com/routstrai" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Twitter</Link>
          <Link href="https://njump.me/npub130mznv74rxs032peqym6g3wqavh472623mt3z5w73xq9r6qqdufs7ql29s" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Nostr</Link>
          <Link href="https://github.com/routstr" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</Link>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Routstr. Licensed under GNU General Public License v3.0</p>
      </div>
    </footer>
  );
} 