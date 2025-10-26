import Link from "next/link"
import { Menu, X, Gamepad2, Trophy, User } from "lucide-react"

export default function NavBar() {
  return (
    <nav className="w-full p-5 border-b border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-wordcherryYellow text-center text-3xl md:text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] leading-tight"
          >
            WORDCHERRY
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/solo"
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <Gamepad2 />
          </Link>
          <Link
            href="/leaderboard"
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <Trophy />
          </Link>
          <Link
            href={"/account"}
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <User />
          </Link>
        </div>
      </div>
    </nav>
  )
}
