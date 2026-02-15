import { Suspense } from "react"
import JoinForm from "./components/JoinForm"

export default function Home() {
  return (
    <div className="py-8">
      <div className="space-y-4 sm:space-y-4 md:space-y-6">
        <Suspense fallback={<div className="h-40" />}>
          <JoinForm />
        </Suspense>

        {/* FAQ Section */}
        <div className="mt-8 md:mt-10">
          <section className="relative overflow-hidden rounded-2xl border border-white/20 bg-wordcherryYellow px-4 py-5 shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:px-6 sm:py-6">

              <div className="relative mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="inline-block rounded-full bg-wordcherryBlue/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-wordcherryBlue">
                    Game Guide
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-wordcherryBlue sm:text-3xl">
                    FAQ
                  </h2>
                </div>
              </div>

              <div className="relative space-y-3">
                <details className="group rounded-xl border border-wordcherryBlue/25 bg-white/75 backdrop-blur-sm transition-colors open:border-wordcherryBlue/45 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-wordcherryBlue">
                    <span className="font-bold">How do I play?</span>
                    <span className="rounded-md bg-wordcherryBlue/10 px-2 py-1 text-xs font-black transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="border-t border-wordcherryBlue/15 px-4 pb-4 pt-3">
                    <p className="mb-3 text-sm font-semibold text-wordcherryBlue">
                      Build words with letter tiles to score points and extend your time.
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 px-3 py-2 text-sm text-wordcherryBlue">1. Start with 10 random tiles and build words to earn time.</div>
                      <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 px-3 py-2 text-sm text-wordcherryBlue">2. Click tiles or type to build words.</div>
                      <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 px-3 py-2 text-sm text-wordcherryBlue">3. Submit valid words to get new tiles and bonuses.</div>
                      <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 px-3 py-2 text-sm text-wordcherryBlue">4. Longer words give better points and more time.</div>
                    </div>
                  </div>
                </details>

                <details className="group rounded-xl border border-wordcherryBlue/25 bg-white/75 backdrop-blur-sm transition-colors open:border-wordcherryBlue/45 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-wordcherryBlue">
                    <span className="font-bold">How does scoring work?</span>
                    <span className="rounded-md bg-wordcherryBlue/10 px-2 py-1 text-xs font-black transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="space-y-4 border-t border-wordcherryBlue/15 px-4 pb-4 pt-3">
                    <div>
                      <p className="mb-2 text-sm font-bold text-wordcherryBlue">Letter Values</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-2"><div className="text-gray-600">Common (1pt)</div><div className="font-mono font-bold text-wordcherryBlue">E S I A R N T O</div></div>
                        <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-2"><div className="text-gray-600">Uncommon (2pt)</div><div className="font-mono font-bold text-wordcherryBlue">L C D U P M G</div></div>
                        <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-2"><div className="text-gray-600">Rare (3-5pt)</div><div className="font-mono font-bold text-wordcherryBlue">H B Y F V K W</div></div>
                        <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-2"><div className="text-gray-600">Very Rare (6-8pt)</div><div className="font-mono font-bold text-wordcherryBlue">Z X J Q</div></div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-bold text-wordcherryBlue">Length Multipliers</p>
                      <div className="grid grid-cols-5 gap-1 text-xs">
                        <div className="rounded-md border border-wordcherryBlue/20 bg-white px-1 py-1 text-center"><div className="text-gray-500">3</div><div className="font-bold text-wordcherryBlue">0.5x</div></div>
                        <div className="rounded-md border border-wordcherryBlue/20 bg-white px-1 py-1 text-center"><div className="text-gray-500">4</div><div className="font-bold text-wordcherryBlue">1x</div></div>
                        <div className="rounded-md border border-wordcherryBlue/20 bg-white px-1 py-1 text-center"><div className="text-gray-500">5-6</div><div className="font-bold text-wordcherryBlue">2x</div></div>
                        <div className="rounded-md border border-wordcherryBlue/20 bg-white px-1 py-1 text-center"><div className="text-gray-500">7-8</div><div className="font-bold text-wordcherryBlue">3x</div></div>
                        <div className="rounded-md border border-wordcherryBlue/20 bg-white px-1 py-1 text-center"><div className="text-gray-500">9+</div><div className="font-bold text-wordcherryBlue">4x</div></div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryBlue/5 p-3 text-xs">
                      <p className="mb-2 font-semibold text-wordcherryBlue">Time Bonuses</p>
                      <div className="space-y-1 text-gray-700">
                        <div className="flex justify-between"><span>3-4 letters</span><span className="font-bold text-wordcherryBlue">+1s base</span></div>
                        <div className="flex justify-between"><span>5-6 letters</span><span className="font-bold text-wordcherryBlue">+2s base</span></div>
                        <div className="flex justify-between"><span>7+ letters</span><span className="font-bold text-wordcherryBlue">+2s base</span></div>
                        <div className="flex justify-between"><span>Score bonus</span><span className="font-bold text-wordcherryBlue">15% of word score</span></div>
                      </div>
                    </div>
                  </div>
                </details>

                <details className="group rounded-xl border border-wordcherryBlue/25 bg-white/75 backdrop-blur-sm transition-colors open:border-wordcherryBlue/45 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-wordcherryBlue">
                    <span className="font-bold">Any tips for scoring higher?</span>
                    <span className="rounded-md bg-wordcherryBlue/10 px-2 py-1 text-xs font-black transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="grid gap-2 border-t border-wordcherryBlue/15 px-4 pb-4 pt-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-3">
                      <p className="text-sm font-bold text-wordcherryBlue">Target 5+ Letters</p>
                      <p className="mt-1 text-xs text-gray-700">Better time bonuses and multipliers.</p>
                    </div>
                    <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-3">
                      <p className="text-sm font-bold text-wordcherryBlue">Use Rare Letters</p>
                      <p className="mt-1 text-xs text-gray-700">Q, J, X, Z are high-value letters.</p>
                    </div>
                    <div className="rounded-lg border border-wordcherryBlue/20 bg-wordcherryYellow/20 p-3">
                      <p className="text-sm font-bold text-wordcherryBlue">Avoid 3-Letter Spam</p>
                      <p className="mt-1 text-xs text-gray-700">Use short words mainly for survival.</p>
                    </div>
                  </div>
                </details>
              </div>
          </section>
        </div>
      </div>
    </div>
  )
}
