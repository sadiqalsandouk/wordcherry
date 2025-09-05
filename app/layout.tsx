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
  title: "Applegrams",
  description:
    "Applegrams is a word game where you can play solo or with friends. Build words to score points and have fun!",
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
