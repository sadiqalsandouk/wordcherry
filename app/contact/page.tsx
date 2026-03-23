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
                  Have a question, found a bug, or just want to say something? Send an email and
                  we will get back to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Email</h2>
                <p className="text-gray-700 mb-2">
                  For anything — general questions, feedback, bug reports, or feature ideas:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <a
                    href="mailto:sadiqdotdigital@gmail.com"
                    className="font-mono text-sm text-wordcherryBlue underline"
                  >
                    sadiqdotdigital@gmail.com
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We typically respond within 1–3 business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Bug Reports</h2>
                <p className="text-gray-700">
                  If you found something broken, it helps to include your browser (e.g. Chrome on
                  iPhone), what you were doing, and what went wrong. The more detail the better —
                  it makes it much faster to track down and fix.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Feature Ideas</h2>
                <p className="text-gray-700">
                  We are always open to ideas. If there is something you think would make
                  WordCherry more fun or useful, feel free to share it. No promises, but
                  everything gets read.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Common Questions</h2>
                <p className="text-gray-700 mb-3">
                  Many questions are already answered in the FAQ on the home page and the strategy
                  guide. Worth checking before writing in.
                </p>
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
