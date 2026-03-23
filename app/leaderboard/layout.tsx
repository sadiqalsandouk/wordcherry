import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard - WordCherry",
  description:
    "See the top WordCherry scores from players around the world. Compete in solo and multiplayer modes to claim your place on the global leaderboard.",
  openGraph: {
    title: "WordCherry Leaderboard",
    description: "Top solo and multiplayer scores from WordCherry players worldwide.",
    url: "https://wordcherry.com/leaderboard",
  },
}

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
