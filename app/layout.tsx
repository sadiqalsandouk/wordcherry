import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Applegrams - Fun Word Game",
  description:
    "Applegrams is an exciting word game where you create words from letter tiles to score points. Play solo to challenge yourself or compete with friends in this engaging anagram puzzle game.",
  keywords: [
    "word game",
    "anagram",
    "puzzle",
    "letters",
    "vocabulary",
    "multiplayer",
    "solo game",
    "tiles",
    "words",
    "spelling",
  ],
  authors: [{ name: "Applegrams Team" }],
  creator: "Applegrams Team",
  publisher: "Applegrams",
  robots: "index, follow",
  openGraph: {
    title: "Applegrams - Fun Word Game",
    description:
      "Create words from letter tiles and score points in this exciting anagram puzzle game. Play solo or with friends!",
    url: "https://applegrams.com",
    siteName: "Applegrams",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Applegrams - Fun Word Game",
    description:
      "Create words from letter tiles and score points in this exciting anagram puzzle game. Play solo or with friends!",
    creator: "@applegrams",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
  colorScheme: "light",
  category: "games",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Applegrams",
    startupImage: "/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-applegramBlue min-h-screen flex flex-col justify-center`}
      >
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-8">{children}</div>
      </body>
    </html>
  )
}
