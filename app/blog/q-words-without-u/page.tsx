import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Q Words Without U: The Complete Word Game Reference | WordCherry Blog",
  description:
    "A complete guide to every practical Q-without-U word, organised by length with points analysis and strategy tips for word game players.",
}

const qWords3 = ["QAT", "QIS", "QUA"]
const qWords4 = ["QADI", "QAID", "QOPH", "QATS", "QOPH"]
const qWords5 = ["QANAT", "QAIDS", "QADIS", "TRANQ", "QOPHS"]
const qWords6 = ["QANATS", "QINTAR", "QWERTY"]
const qWords7 = ["QINTARS", "QABALAH"]

export default function QWordsWithoutUPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">Q Words Without U: The Complete Word Game Reference</h1>
        </div>
        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">

              <section>
                <p className="text-gray-500 text-sm mb-4">5 min read · WordCherry Blog</p>
                <p className="text-gray-700 leading-relaxed">
                  In standard English, Q is almost always followed by U. QUEEN, QUICK, QUOTE —
                  the QU pairing is so consistent that most players instinctively feel that Q
                  without U is unusable. This belief is both wrong and expensive. Q is worth
                  8 points in WordCherry, making it one of the highest-value letters in the game.
                  Knowing how to play it without a U is one of the most significant edges a
                  player can have.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Why Q Without U Matters in Word Games</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Q tile is rare and extremely high value. When you draw Q without a U in your
                  tiles, most players either hold the Q hoping a U appears, or panic and play a
                  short word that does not use Q at all. Both approaches waste the tile's potential.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The Q-without-U words in standard dictionaries come from several sources: Arabic
                  loanwords (QADI, a judge; QANAT, an irrigation channel), Hebrew transliterations
                  (QOPH, a letter of the Hebrew alphabet), and a handful of other borrowings.
                  Most of them entered English through scholarly or technical channels, which is
                  why they are less familiar to most speakers — but they are entirely valid in
                  major English dictionaries and word game word lists.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Knowing even three or four of these words will meaningfully improve your game.
                  The Q tile no longer becomes a liability when you have no U — it becomes an
                  opportunity.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">3-Letter Q Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Three-letter words score at 0.5× multiplier, so they are not ideal for Q tiles —
                  but they are better than not playing Q at all. Use these only when the clock is
                  critical and you need to survive:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {qWords3.map((w) => (
                    <span key={w} className="bg-white rounded-lg px-3 py-2 font-mono font-semibold text-gray-800 border border-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                  <p><strong>QAT</strong> — a plant whose leaves are chewed as a stimulant; also spelled khat.</p>
                  <p><strong>QIS</strong> — plural of qi, the life force in Chinese philosophy.</p>
                  <p><strong>QUA</strong> — in the capacity of; as being.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">4-Letter Q Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Four-letter words hit the 1× multiplier — a meaningful step up. These are your
                  go-to Q plays when you do not have the tiles for something longer:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {qWords4.filter((v, i, a) => a.indexOf(v) === i).map((w) => (
                    <span key={w} className="bg-white rounded-lg px-3 py-2 font-mono font-semibold text-gray-800 border border-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                  <p><strong>QADI</strong> — a Muslim judge who interprets and applies Islamic law. Also CADI.</p>
                  <p><strong>QAID</strong> — a Muslim leader or chieftain. From Arabic qa'id.</p>
                  <p><strong>QOPH</strong> — the 19th letter of the Hebrew alphabet.</p>
                  <p><strong>QATS</strong> — plural of qat.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">5-Letter Q Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Five-letter words reach the 2× multiplier. With Q worth 8 points, a 5-letter
                  Q word can easily be worth 20-30 points. These are the ones most worth memorising:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {qWords5.filter((v, i, a) => a.indexOf(v) === i).map((w) => (
                    <span key={w} className="bg-white rounded-lg px-3 py-2 font-mono font-semibold text-gray-800 border border-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                  <p><strong>QANAT</strong> — an ancient Persian underground irrigation channel. Q(8)+A(1)+N(1)+A(1)+T(1) = 12 base × 2 = 24 points, plus time bonus.</p>
                  <p><strong>QAIDS</strong> — plural of qaid.</p>
                  <p><strong>QADIS</strong> — plural of qadi.</p>
                  <p><strong>TRANQ</strong> — short for tranquilliser. Note: requires T, R, A, N — common letters.</p>
                  <p><strong>QOPHS</strong> — plural of qoph.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">6-Letter Q Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Six letters maintains the 2× multiplier but gives more base points. Rare and
                  memorable — worth knowing for exceptional hands:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {qWords6.map((w) => (
                    <span key={w} className="bg-white rounded-lg px-3 py-2 font-mono font-semibold text-gray-800 border border-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                  <p><strong>QANATS</strong> — plural of qanat.</p>
                  <p><strong>QINTAR</strong> — a unit of currency in Albania (1/100 of a lek).</p>
                  <p><strong>QWERTY</strong> — the standard keyboard layout, named for its first six keys.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">7+ Letter Q Words</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Reaching 7+ letters with Q gives a 3× multiplier. These are exceptional plays
                  that require specific tiles, but worth knowing:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {qWords7.map((w) => (
                    <span key={w} className="bg-white rounded-lg px-3 py-2 font-mono font-semibold text-gray-800 border border-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                  <p><strong>QINTARS</strong> — plural of qintar.</p>
                  <p><strong>QABALAH</strong> — variant spelling of Kabbalah, the mystical Jewish tradition.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Strategy: How to Use Q Without U in WordCherry</h2>
                <div className="text-gray-700 space-y-3">
                  <p>
                    When you draw a Q tile, immediately scan your other tiles for A, N, T, I, O, D —
                    the letters that most frequently appear alongside Q in these words. QANAT
                    requires Q, A, N, T — all relatively common. QADI requires Q, A, D, I — also
                    common.
                  </p>
                  <p>
                    Do not hold Q waiting for a U. The U may not appear, and holding Q means
                    wasting one of your 10 tile slots. The ideal play is to use Q as soon as you
                    can find a valid word, even a short one, rather than sitting on it.
                  </p>
                  <p>
                    If you have Q and U, standard QU words are generally better: QUIZ (4 letters,
                    Q+U+I+Z for 8+1+1+8=18 base × 1 = 18 points), QUARTZ (6 letters, 20 base × 2
                    = 40 points). But if U is not available, these Q-without-U words are your next
                    best option.
                  </p>
                  <p>
                    The single most valuable word to memorise from this list is <strong>QANAT</strong>.
                    It is 5 letters, uses only common letters alongside Q, and delivers consistent
                    high-value plays whenever Q appears in your tiles without a U.
                  </p>
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
