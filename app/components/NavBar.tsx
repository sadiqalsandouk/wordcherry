import Link from "next/link"

export default function NavBar() {
  return (
    <nav className="w-full py-4 border-b border-white/20">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-6">
          <Link
            href="/leaderboard"
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            Leaderboard
          </Link>
          <Link
            href="/solo"
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            Play Solo
          </Link>
        </div>
      </div>
    </nav>
  )
}
