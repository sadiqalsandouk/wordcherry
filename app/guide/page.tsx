import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WordCherry Strategy Guide - Tips, Tricks & High Score Secrets",
  description:
    "Master WordCherry with our complete strategy guide. Learn scoring mechanics, the best word strategies, high-value letter combinations, and advanced tips to dominate the leaderboard.",
}

export default function GuidePage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">Strategy Guide</h1>
        </div>

        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">

              <section>
                <p className="text-gray-700 leading-relaxed">
                  Whether you are playing for the first time or trying to crack the top 10 on the
                  leaderboard, this guide covers how scoring actually works and the strategies that
                  separate high scorers from average runs.
                </p>
              </section>

              {/* Scoring */}
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">How Scoring Works</h2>
                <div className="text-gray-700 space-y-3">
                  <p>
                    Every word score is calculated the same way: add up the point value of each
                    letter, then multiply by a bonus based on word length. Short words score at a
                    discount; longer words get multiplied.
                  </p>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Letter values</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">1 point — Common</div>
                        <div className="font-mono font-semibold text-gray-800">E S I A R N T O</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">2 points — Uncommon</div>
                        <div className="font-mono font-semibold text-gray-800">L C D U P M G</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">3–5 points — Rare</div>
                        <div className="font-mono font-semibold text-gray-800">H B Y F V K W</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">6–8 points — Very Rare</div>
                        <div className="font-mono font-semibold text-gray-800">Z X J Q</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Length multipliers</p>
                    <div className="grid grid-cols-5 gap-1 text-xs text-center">
                      {[
                        { len: "3", mult: "0.5×" },
                        { len: "4", mult: "1×" },
                        { len: "5–6", mult: "2×" },
                        { len: "7–8", mult: "3×" },
                        { len: "9+", mult: "4×" },
                      ].map((row) => (
                        <div key={row.len} className="bg-gray-50 rounded-lg p-2">
                          <div className="text-gray-500">{row.len} letters</div>
                          <div className="font-bold text-gray-800 text-sm">{row.mult}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-gray-800 mb-1">Example</p>
                    <p className="text-gray-700">
                      QUARTZ (6 letters): Q(8) + U(1) + A(1) + R(1) + T(1) + Z(8) = 20 base
                      points × 2 = <strong>40 points</strong>, plus a time bonus. That one word is
                      worth more than ten 3-letter words combined.
                    </p>
                  </div>
                </div>
              </section>

              {/* Time */}
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Managing the Clock</h2>
                <div className="text-gray-700 space-y-3">
                  <p>
                    Every word adds time back. The base bonus depends on word length, and you also
                    get 15% of your word score added as extra seconds — so a 40-point word adds
                    6 seconds on top of the base.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">3–4 letter words</span>
                      <span className="font-semibold text-gray-800">+1s base</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">5–6 letter words</span>
                      <span className="font-semibold text-gray-800">+2s base</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">7+ letter words</span>
                      <span className="font-semibold text-gray-800">+2s base</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score bonus</span>
                      <span className="font-semibold text-gray-800">+15% of word score in seconds</span>
                    </div>
                  </div>
                  <p>
                    This is why high-value words are doubly powerful — they boost your score and
                    keep the clock healthy at the same time.
                  </p>
                </div>
              </section>

              {/* Core Tips */}
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Core Strategies</h2>
                <div className="text-gray-700 space-y-4">

                  <div>
                    <p className="font-semibold text-gray-800">Always prioritise rare tiles</p>
                    <p>
                      When you draw a Q, Z, X, or J, your first move should be to build a word
                      around it. These tiles are worth 6–8 points each, and wasting them in a
                      3-letter word at 0.5× multiplier is one of the most common mistakes. Words
                      like JAZZ, JINX, EXAM, QUIZ, ZONE, and ZINC let you cash in properly.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Aim for 5–6 letters, not 9+</p>
                    <p>
                      Nine-letter words are amazing when they happen, but they require the perfect
                      tiles and take time to find under pressure. The 5–6 letter range gives a 2×
                      multiplier, a solid time bonus, and is achievable on most draws. Consistently
                      hitting this range will outscore players who gamble on rare long words.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Keep 3-letter words as a safety net</p>
                    <p>
                      If the clock drops below 5 seconds and you cannot see a long word, submit
                      anything valid. Words like THE, ARE, RAN, TOP, CUP, NET, TAN keep you alive.
                      Surviving on short words is always better than timing out while searching for
                      the perfect play.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Look for suffixes before submitting</p>
                    <p>
                      Before you play a 4-letter word, scan your remaining tiles for -S, -ED, -ING,
                      or -ER. Adding two letters can jump you from a 1× to a 2× multiplier for
                      free. This habit alone can meaningfully increase your average word score.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">In multiplayer, speed beats perfection</p>
                    <p>
                      Solo mode rewards finding the best word. Multiplayer rewards finding a good
                      word fast. If you spend 10 seconds searching for something better, your
                      opponent has already submitted two words. See something valid — play it.
                    </p>
                  </div>
                </div>
              </section>

              {/* Word Lists */}
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Words Worth Knowing</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Top players keep a mental list of reliable high-value words. Here are some
                    worth internalising:
                  </p>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Q words that don&apos;t need U</p>
                    <div className="flex flex-wrap gap-2">
                      {["QANAT", "QOPH", "QADI", "QAID", "QAIDS", "TRANQ", "QATS"].map((w) => (
                        <span key={w} className="bg-gray-100 rounded px-2 py-1 font-mono text-sm text-gray-800">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">High-value Z words</p>
                    <div className="flex flex-wrap gap-2">
                      {["JAZZ", "FIZZ", "BUZZ", "ZEAL", "ZERO", "ZONE", "ZINC", "ZOOM", "ZEST", "BLAZE"].map((w) => (
                        <span key={w} className="bg-gray-100 rounded px-2 py-1 font-mono text-sm text-gray-800">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">7-letter words with common letters</p>
                    <div className="flex flex-wrap gap-2">
                      {["TRAINED", "STAINED", "STRANGE", "PAINTER", "PARTIES", "GRANITE", "RETAINS"].map((w) => (
                        <span key={w} className="bg-gray-100 rounded px-2 py-1 font-mono text-sm text-gray-800">
                          {w}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      These hit the 3× multiplier using letters you will often have available.
                    </p>
                  </div>
                </div>
              </section>

              {/* Mistakes */}
              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Common Mistakes</h2>
                <div className="text-gray-700 space-y-3">
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Spamming 3-letter words.</strong> They score at 0.5× and give
                      minimal time. Only use them when the clock is critical.
                    </li>
                    <li>
                      <strong>Ignoring the timer.</strong> It is easy to focus on building a word
                      and let the clock drain to zero. Keep one eye on it at all times.
                    </li>
                    <li>
                      <strong>Not checking for suffixes.</strong> Always check for -S, -ED, -ING
                      before submitting — free multiplier upgrades are often sitting there.
                    </li>
                    <li>
                      <strong>Holding rare tiles too long.</strong> Waiting for the perfect moment
                      to use your Q often means never using it at all. Play it in the first
                      reasonable word you can build.
                    </li>
                  </ul>
                </div>
              </section>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 text-center bg-wordcherryBlue text-white font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/90 transition-colors"
              >
                Play Now
              </Link>
              <Link
                href="/leaderboard"
                className="flex-1 text-center border border-wordcherryBlue text-wordcherryBlue font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/5 transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
