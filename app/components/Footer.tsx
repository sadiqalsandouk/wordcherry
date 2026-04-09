import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-white/20">
      <div className="text-center text-white/70 text-sm">
        <div className="mb-2">
          <Link href="/">
            <Image
              src="/wordcherry-logo.svg"
              alt="WordCherry"
              width={160}
              height={48}
              className="mx-auto h-10 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="text-xs mb-2">© 2026 WordCherry. All rights reserved.</div>
        <div className="text-xs mb-2">
          Word list sourced from{" "}
          <Link
            href="https://github.com/dwyl/english-words"
            className="text-white/60 hover:text-white transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            dwyl/english-words
          </Link>
          .
        </div>
        <div className="text-xs space-x-4 mb-2">
          <Link href="/about" className="text-white/60 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/guide" className="text-white/60 hover:text-white transition-colors">
            Strategy Guide
          </Link>
          <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/leaderboard" className="text-white/60 hover:text-white transition-colors">
            Leaderboard
          </Link>
        </div>
        <div className="text-xs space-x-4">
          <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
