import Link from "next/link"
import { Gamepad2, Trophy, User } from "lucide-react"

export default function NavBar() {
  return (
    <nav className="w-full px-4 py-3 border-b border-white/20">
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/"
          className="text-wordcherryYellow text-center font-bold tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] leading-none text-[clamp(1.5rem,5vw,2.6rem)] transition-all duration-300 ease-in-out"
        >
          WORDCHERRY
        </Link>
        <div className="flex items-center gap-4 text-base">
          <Link href="/solo" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
            <Gamepad2 />
          </Link>
          <Link
            href="/leaderboard"
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <Trophy />
          </Link>
          <Link href={"/account"} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
            <User />
          </Link>
        </div>
      </div>
    </nav>
  )
}
