export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-white/20">
      <div className="text-center text-white/70 text-sm">
        <div className="mb-2">
          <a href="/" className="font-bold text-wordcherryYellow">
            WordCherry
          </a>
        </div>
        <div className="text-xs mb-2">© 2025 WordCherry. All rights reserved.</div>
        <div className="text-xs space-x-4">
          <a href="/leaderboard" className="text-white/60 hover:text-white transition-colors">
            Leaderboard
          </a>
          <a href="/privacy" className="text-white/60 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
