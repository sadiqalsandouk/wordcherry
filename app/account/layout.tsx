import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account - WordCherry",
  description: "Manage your WordCherry account.",
  robots: "noindex, nofollow",
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
