import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About WordCherry - The Fast-Paced Word Tile Game",
  description:
    "Learn about WordCherry, the free browser-based word game where you build words from letter tiles to score points. Play solo or challenge friends in real-time multiplayer.",
}

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">About WordCherry</h1>
        </div>

        <div className="bg-[#fff7d6] p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-6">

              <section>
                <p className="text-gray-700 leading-relaxed">
                  WordCherry is a free, fast-paced word game that challenges you to build words
                  from letter tiles before the clock runs out. Whether you play solo to beat your
                  own high score or jump into a live multiplayer match with friends, the whole idea
                  is quick thinking and a love of language.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">How It Works</h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    You start each game with 10 random letter tiles. Form valid English words using
                    those tiles and submit them — every word you play earns points and adds time
                    back to your countdown. Run out of time and the game ends.
                  </p>
                  <p>
                    Longer words score more and give more time, so there is a constant tension
                    between going for the safe 4-letter word right in front of you or hunting for a
                    7-letter monster that could push your score into a different league.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Game Modes</h2>
                <div className="text-gray-700 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">Solo</p>
                    <p>
                      The classic WordCherry experience. Race against your own timer and try to
                      post the highest score possible. Solo scores are tracked on the global
                      leaderboard — see how you stack up against players around the world.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Multiplayer</p>
                    <p>
                      Create a private lobby and share the code with friends, or join a public
                      game. All players compete in real time using a shared letter pool. The player
                      with the most points when time runs out wins. It gets surprisingly intense.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">The Story</h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    WordCherry was built as a passion project by a solo developer who wanted a word
                    game that felt snappy and genuinely competitive — something you could share with
                    friends and immediately start playing with no app store, no tutorial, and no
                    paywalls.
                  </p>
                  <p>
                    The tech stack is Next.js and React on the frontend, with Supabase handling
                    real-time multiplayer via WebSockets, user accounts, and the global leaderboard.
                    Word validation runs against a large English dictionary sourced from the
                    open-source{" "}
                    <a
                      href="https://github.com/dwyl/english-words"
                      className="text-wordcherryBlue underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      dwyl/english-words
                    </a>{" "}
                    list.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-wordcherryBlue mb-3">Why Play WordCherry?</h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    It is free, requires no download, and works on any modern browser — desktop or
                    mobile. Solo play does not even need an account. Create a free account if you
                    want your scores saved to the leaderboard or want to play multiplayer.
                  </p>
                  <p>
                    The letter tiles are randomly generated every game, so no two runs are the
                    same. And because the scoring rewards vocabulary depth — rare letters and longer
                    words pay off disproportionately — regular play genuinely expands what words
                    you reach for instinctively.
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
                href="/guide"
                className="flex-1 text-center border border-wordcherryBlue text-wordcherryBlue font-bold px-6 py-3 rounded-lg hover:bg-wordcherryBlue/5 transition-colors"
              >
                Strategy Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
