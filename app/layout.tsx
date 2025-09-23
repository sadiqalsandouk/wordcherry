import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import Footer from "./components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#2bb7bf",
}

export const metadata: Metadata = {
  title: "Wordcherry - Fun Word Game",
  description:
    "Wordcherry is an exciting word game where you create words from letter tiles to score points. Play solo to challenge yourself or compete with friends in this engaging anagram puzzle game.",
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
  authors: [{ name: "Wordcherry Team" }],
  creator: "Wordcherry Team",
  publisher: "Wordcherry",
  robots: "index, follow",
  openGraph: {
    title: "Wordcherry - Fun Word Game",
    description:
      "Create words from letter tiles and score points in this exciting anagram puzzle game. Play solo or with friends!",
    url: "https://wordcherry.com",
    siteName: "Wordcherry",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordcherry - Fun Word Game",
    description:
      "Create words from letter tiles and score points in this exciting anagram puzzle game. Play solo or with friends!",
    creator: "@wordcherry",
  },
  category: "games",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wordcherry",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-wordcherryBlue min-h-screen flex flex-col justify-center`}
      >
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-2 sm:py-4 md:py-8">
          {children}
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
