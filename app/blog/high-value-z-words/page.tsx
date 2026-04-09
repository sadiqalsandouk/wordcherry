import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "High-Scoring Z Words: A Word Game Player's Guide | WordCherry Blog",
  description:
    "The Z tile is worth 8 points — one of the highest in the game. Here are the best Z words to memorise, from three letters to seven, with strategy tips.",
}

export default function HighValueZWordsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">High-Scoring Z Words: A Word Game Player&apos;s Guide</h1>
        </div>
        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">

              <section>
                <p className="text-gray-500 text-sm mb-4">5 min read · WordCherry Blog</p>
                <p className="text-gray-700 leading-relaxed">
                  Z is worth 8 points in WordCherry — tied with Q as the highest-value single
                  letter in the game. Unlike Q, Z is also far more versatile: it can appear at the
                  start, middle, or end of words, pairs naturally with many common letters, and
                  works in some of the most satisfying plays in the game (JAZZ, BUZZ, FIZZ, BLAZE).
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  This guide covers every category of Z word you should know, from short survival
                  plays to high-multiplier combinations that can define a game.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">The Value of Z: A Quick Calculation</h2>
                <p className="text-gray-700 leading-relaxed">
                  Understanding the value of Z starts with the numbers. At 8 points per tile, Z
                  contributes significantly to any word it appears in. A 5-letter word containing Z
                  might have a base score of 12-16 points — which at 2× multiplier gives 24-32
                  points from a single word. Add a time bonus on top of that.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Words with double Z are even more extraordinary. JAZZ: J(6)+A(1)+Z(8)+Z(8) = 23
                  base × 1 = 23 points at 4 letters. FIZZ: F(4)+I(1)+Z(8)+Z(8) = 21 base points.
                  These are exceptional payoffs for 4-letter words. If you can stretch a double-Z
                  word to 5 letters, the 2× multiplier makes it one of the highest-scoring plays
                  in the entire game.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">3-Letter Z Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Three-letter Z words score at 0.5× multiplier, so they are primarily clock
                  management tools. But when you need time and Z is your only option, knowing these
                  saves games:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { word: "ZAP", meaning: "to strike or destroy suddenly" },
                    { word: "ZAG", meaning: "to turn sharply; opposite of zig" },
                    { word: "ZEN", meaning: "a form of Buddhism; a state of calm" },
                    { word: "ZIP", meaning: "to move fast; a fastener" },
                    { word: "ZIT", meaning: "informal for a pimple" },
                    { word: "ZOO", meaning: "a place where animals are kept" },
                    { word: "ZAX", meaning: "a tool for cutting roof slates" },
                    { word: "ZEP", meaning: "variant; check dictionary validity" },
                  ].map(({ word, meaning }) => (
                    <div key={word} className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="font-mono font-bold text-gray-800">{word}</span>
                      <p className="text-xs text-gray-500 mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 text-sm">
                  Note: ZAX is particularly worth knowing because X also carries high value (5 points), making it a useful play even at short length.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">4-Letter Z Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Four-letter words reach the 1× multiplier. Z in a 4-letter word already delivers
                  solid points:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { word: "JAZZ", meaning: "a music genre; to make more lively. J+Z+Z = 22 base points" },
                    { word: "FIZZ", meaning: "to make a hissing, bubbling sound. F+Z+Z = 21 base" },
                    { word: "BUZZ", meaning: "a low humming sound. B+Z+Z = 19 base" },
                    { word: "ZEAL", meaning: "great enthusiasm or energy" },
                    { word: "ZERO", meaning: "the number 0; to focus precisely on" },
                    { word: "ZINC", meaning: "a metallic element; to coat with zinc" },
                    { word: "ZONE", meaning: "an area with a particular characteristic" },
                    { word: "ZOOM", meaning: "to move quickly; to enlarge" },
                    { word: "ZEST", meaning: "enthusiasm; the outer peel of citrus" },
                    { word: "ZING", meaning: "a sharp piercing sound; to move rapidly" },
                  ].map(({ word, meaning }) => (
                    <div key={word} className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="font-mono font-bold text-gray-800">{word}</span>
                      <p className="text-xs text-gray-500 mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">5–6 Letter Z Words (2× Multiplier)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  This is where Z words become truly powerful. At 2×, even a modest base score
                  delivers impressive points:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { word: "BLAZE", meaning: "a bright flame; to burn intensely" },
                    { word: "GRAZE", meaning: "to feed on growing grass; to lightly scrape" },
                    { word: "CRAZE", meaning: "a widespread fashion or enthusiasm; to make cracks" },
                    { word: "FROZE", meaning: "past tense of freeze" },
                    { word: "OZONE", meaning: "a form of oxygen found in the atmosphere" },
                    { word: "GAUZE", meaning: "a thin transparent fabric; a loose weave" },
                    { word: "FUZZY", meaning: "covered in fuzz; not clear or distinct" },
                    { word: "JAZZY", meaning: "resembling jazz; showy and bright" },
                    { word: "FIZZY", meaning: "producing bubbles; effervescent" },
                    { word: "ZONED", meaning: "divided into zones; past tense of zone" },
                    { word: "ZONES", meaning: "plural of zone" },
                    { word: "ZONAL", meaning: "relating to or divided into zones" },
                  ].map(({ word, meaning }) => (
                    <div key={word} className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="font-mono font-bold text-gray-800">{word}</span>
                      <p className="text-xs text-gray-500 mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">7-Letter Z Words (3× Multiplier)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Seven-letter Z words are exceptional plays. Z at 8 points in a word with 3×
                  multiplier delivers enormous scores. These require specific tiles but are worth
                  knowing:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { word: "BLAZING", meaning: "burning fiercely; very hot and bright" },
                    { word: "GLAZING", meaning: "fitting glass into windows; a thin coating" },
                    { word: "GRAZING", meaning: "feeding on grass; lightly touching" },
                    { word: "CRAZIER", meaning: "more crazy; comparative of crazy" },
                    { word: "GAZETTE", meaning: "an official newspaper or journal" },
                    { word: "ZEALOUS", meaning: "having or showing great enthusiasm" },
                    { word: "BUZZARD", meaning: "a large bird of prey; a contemptible person" },
                    { word: "BLIZZARD", meaning: "a severe snowstorm with high winds (8 letters, 4× mult)" },
                  ].map(({ word, meaning }) => (
                    <div key={word} className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="font-mono font-bold text-gray-800">{word}</span>
                      <p className="text-xs text-gray-500 mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Z Strategy: Getting the Most From the Tile</h2>
                <div className="text-gray-700 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">Never waste Z on a 3-letter word if you can avoid it</p>
                    <p className="mt-1">
                      With Z worth 8 points, playing it at 0.5× multiplier gives you just 4 points
                      of Z contribution. The same tile in a 5-letter word contributes 16 points.
                      Unless the clock is critical, always try to build a 4+ letter word around Z.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Look for -ING and -ED extensions on Z words</p>
                    <p className="mt-1">
                      BLAZE → BLAZED, BLAZING. ZONE → ZONED, ZONING. FUZZ → FUZZY. These
                      extensions add letters and push you into higher multiplier brackets. When you
                      spot a Z word, immediately check whether you have tiles to extend it.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Know your double-Z words cold</p>
                    <p className="mt-1">
                      JAZZ, FIZZ, BUZZ, FUZZ, RAZZ — these are the most commonly achievable
                      double-Z words. Having two Z tiles is rare, but when it happens, playing a
                      double-Z word is almost always the highest-value move on the board.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Z at the end is often easiest</p>
                    <p className="mt-1">
                      English words ending in Z are less common than Z-initial words, but they
                      include some powerful options: FIZZ, JAZZ, BUZZ, WHIZ. When you are scanning
                      tiles, try building from common letters first and ending with Z — this is
                      often easier to construct than starting from Z.
                    </p>
                  </div>
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
