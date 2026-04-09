import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "7-Letter Words Every Word Game Player Should Know | WordCherry Blog",
  description:
    "Seven-letter words unlock the 3× multiplier in WordCherry. Learn the best patterns, anagram seeds, and specific words to add to your mental dictionary.",
}

export default function SevenLetterWordsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">7-Letter Words Every Word Game Player Should Know</h1>
        </div>
        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">

              <section>
                <p className="text-gray-500 text-sm mb-4">6 min read · WordCherry Blog</p>
                <p className="text-gray-700 leading-relaxed">
                  In WordCherry, words of 7–8 letters receive a 3× multiplier — triple the base
                  letter score. That is the difference between a 10-point play and a 30-point play
                  from the same letters. If you can hit a 7-letter word even once per game, it
                  meaningfully changes your score.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The challenge is that 7-letter words feel hard to spot under pressure. This guide
                  will give you the patterns, the seeds, and the specific words to look for so that
                  when the tiles are there, you see them.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Why 7-Letter Words Are Worth Chasing</h2>
                <p className="text-gray-700 leading-relaxed">
                  Consider the numbers. A typical 7-letter word made up of common letters might
                  have a base score of 7-10 points. At 3×, that is 21-30 points. Add the time
                  bonus (15% of word score in seconds) and you are also getting a significant clock
                  extension.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Compare this to five 4-letter words, each scoring 7 base points at 1×: that is
                  also 35 points, but it requires you to find and submit five words in the time it
                  takes to construct one. In practice, a single 7-letter word is often worth
                  two or three average plays — and the time bonus is equally valuable.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The key insight is that you do not need to find 7-letter words constantly.
                  Finding one or two per game is enough to significantly separate your score from
                  players who stay in the 4-5 letter range.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">The SATINE Family: The Most Productive 7-Letter Pattern</h2>
                <p className="text-gray-700 leading-relaxed">
                  Advanced word game players know a concept called the "stem" or "seed" — a set of
                  letters that, combined with one additional letter, form many 7-letter words. The
                  most famous stem in competitive Scrabble is SATINE (or SATIRE, STRAIN, etc.) —
                  a set of six letters that combines with dozens of seventh letters to form valid
                  7-letter words.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The letters S, A, T, I, N, E are all 1-point common tiles, which means they
                  appear frequently in your hand. When you have most of these, start checking for
                  7-letter words:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { word: "TRAINED", extra: "+R+D", base: "ATINE" },
                    { word: "STAINED", extra: "+S+D", base: "TAINE" },
                    { word: "RETAINS", extra: "+R", base: "ETAINS" },
                    { word: "NASTIER", extra: "+R", base: "NASTIES minus S" },
                    { word: "ANTSIER", extra: "+R", base: "ANTSIE" },
                    { word: "ANESTRI", extra: "+R", base: "technical term" },
                    { word: "PAINTER", extra: "+P+R", base: "AINTIER" },
                    { word: "PARTIES", extra: "+P", base: "ARTIES" },
                    { word: "GRANITE", extra: "+G+R", base: "RANITE" },
                    { word: "STRANGE", extra: "+G+R", base: "TRANGE" },
                    { word: "LASTING", extra: "+L+G", base: "LASTIN" },
                    { word: "SEATING", extra: "+G", base: "EATING+S" },
                  ].map(({ word }) => (
                    <div key={word} className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                      <span className="font-mono font-bold text-gray-800">{word}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">7-Letter Words Built on Common Roots</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Many 7-letter words are extensions of familiar 5-6 letter words. Training yourself
                  to think "can I extend this?" before submitting is one of the highest-value habits
                  in word games:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">From 5-letter roots + -ING:</p>
                    <div className="flex flex-wrap gap-2">
                      {["BLAZING", "GRAZING", "GLAZING", "GAZING", "DOZING", "TEASING", "LEAPING", "READING"].map((w) => (
                        <span key={w} className="bg-white rounded px-2 py-1 font-mono text-sm text-gray-800 border border-gray-200">{w}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">From 5-letter roots + -ED + suffix:</p>
                    <div className="flex flex-wrap gap-2">
                      {["STARTED", "PAINTED", "GRANTED", "PLANTED", "PRINTED", "TREATED", "CREATED"].map((w) => (
                        <span key={w} className="bg-white rounded px-2 py-1 font-mono text-sm text-gray-800 border border-gray-200">{w}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Agent nouns (-ER, -OR, -AR):</p>
                    <div className="flex flex-wrap gap-2">
                      {["PAINTER", "PLANTER", "PRINTER", "SENATOR", "CREATOR", "TRAINER", "PLANNER"].map((w) => (
                        <span key={w} className="bg-white rounded px-2 py-1 font-mono text-sm text-gray-800 border border-gray-200">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Productive Prefixes for 7-Letter Construction</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Prefixes reliably generate 7-letter words when you can spot the base:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      prefix: "UN-",
                      examples: ["UNCLEAN", "UNCLEAR", "UNEARTH", "UNTAMED", "UNSATED", "UNSTRAP"],
                    },
                    {
                      prefix: "RE-",
                      examples: ["RESTART", "RETRAIN", "REPRINT", "RESTORE", "RECOUNT", "RECLAIM"],
                    },
                    {
                      prefix: "OUT-",
                      examples: ["OUTRAGE", "OUTPOST", "OUTLAST", "OUTSELL", "OUTPACE", "OUTRANK"],
                    },
                    {
                      prefix: "PRE-",
                      examples: ["PRESIDE", "PRECAST", "PREPARE", "PRESALE", "PRETEND", "PREVAIL"],
                    },
                  ].map(({ prefix, examples }) => (
                    <div key={prefix}>
                      <p className="font-semibold text-gray-700 mb-2">{prefix}</p>
                      <div className="flex flex-wrap gap-2">
                        {examples.map((w) => (
                          <span key={w} className="bg-white rounded px-2 py-1 font-mono text-sm text-gray-800 border border-gray-200">{w}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">How to Spot 7-Letter Words Under Pressure</h2>
                <div className="text-gray-700 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">Start from what you know</p>
                    <p className="mt-1">
                      When you see a 5-letter word in your tiles, immediately ask: do I have any
                      tile that extends it? -S, -D, -R, -ING. This quick check takes less than a
                      second and frequently reveals 6-7 letter plays you would otherwise miss.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Look for -ING opportunities first</p>
                    <p className="mt-1">
                      If you have I, N, G in your tiles, look for a 4-letter verb root. BURN →
                      BURNING (7 letters). TEACH → TEACHING (8). REACH → REACHING (8). The -ING
                      suffix is by far the most productive extension for reaching 7+ letters.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Don't gamble when the clock is low</p>
                    <p className="mt-1">
                      Searching for a 7-letter word takes time. If the clock is under 8 seconds,
                      play the best word you can see immediately. 7-letter words are worth chasing
                      when you have at least 10 seconds of cushion. Below that, survival takes
                      priority.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Memorise 5-6 go-to 7-letter words</p>
                    <p className="mt-1">
                      You do not need to know hundreds of 7-letter words. Knowing 5-6 that use
                      common letters — TRAINED, RETAINS, GRANITE, PAINTER, STRANGE, LASTING — is
                      enough to consistently spot them when the tiles align. These are your anchor
                      plays for the 3× multiplier.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Quick Reference: Best 7-Letter Words to Memorise</h2>
                <p className="text-gray-700 mb-3">
                  These are constructed from the most common letter tiles and should be your first
                  patterns to learn:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "TRAINED", "STAINED", "RETAINS", "GRANITE", "STRANGE", "PAINTER",
                    "PARTIES", "LASTING", "SEATING", "READING", "DEALING", "LEADING",
                    "HEALING", "SEALING", "BEATING", "HEATING", "TESTING", "RESTING",
                    "NESTING", "POSTING", "COSTING", "HOSTING", "ROASTED", "TOASTED",
                  ].map((w) => (
                    <span key={w} className="bg-white rounded px-2 py-1 font-mono text-sm text-gray-800 border border-gray-200">{w}</span>
                  ))}
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
                href="/blog"
                className="flex-1 text-center border border-wordcherryBlue text-wordcherryBlue font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/5 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
