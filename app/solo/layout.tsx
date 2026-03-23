import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Play Solo - WordCherry",
  description:
    "Play WordCherry solo mode. Build words from letter tiles, beat the clock, and post your high score to the global leaderboard. Free to play in your browser.",
  openGraph: {
    title: "Play WordCherry Solo",
    description: "Build words from letter tiles and beat the clock. Free browser word game.",
    url: "https://wordcherry.com/solo",
  },
}

export default function SoloLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
