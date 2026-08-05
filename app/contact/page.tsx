import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact WordCherry - Get in Touch",
  description:
    "Have a question, bug report, or feedback about WordCherry? Get in touch with the team.",
}

export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">Contact</h1>
        </div>

        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-6">

              <section>
                <p className="text-gray-700 leading-relaxed">
                  There is no direct contact channel available right now. Most common questions
                  are already answered in the FAQ and strategy guide below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Common Questions</h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/" className="text-sm text-wordcherryBlue underline">
                    FAQ
                  </Link>
                  <Link href="/guide" className="text-sm text-wordcherryBlue underline">
                    Strategy Guide
                  </Link>
                  <Link href="/about" className="text-sm text-wordcherryBlue underline">
                    About WordCherry
                  </Link>
                  <Link href="/privacy" className="text-sm text-wordcherryBlue underline">
                    Privacy Policy
                  </Link>
                </div>
              </section>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <Link
                href="/"
                className="inline-block bg-wordcherryBlue text-white font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/90 transition-colors"
              >
                Back to Game
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
