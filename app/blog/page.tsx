import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WordCherry Blog - Word Game Tips, Strategies & Word Lists",
  description:
    "Explore word game tips, vocabulary guides, high-scoring word lists, and brain benefits of playing word games. Level up your WordCherry game with expert articles.",
}

const articles = [
  {
    slug: "benefits-of-word-games",
    title: "The Brain Benefits of Playing Word Games",
    description:
      "Research-backed reasons why word games are genuinely good for your brain — from vocabulary growth to memory and problem-solving skills.",
    readTime: "5 min read",
  },
  {
    slug: "improve-vocabulary-word-games",
    title: "How to Improve Your Vocabulary Through Word Games",
    description:
      "Practical techniques for turning game time into genuine vocabulary gains — and why word games are one of the most effective tools available.",
    readTime: "6 min read",
  },
  {
    slug: "q-words-without-u",
    title: "Q Words Without U: The Complete Word Game Reference",
    description:
      "A complete guide to every practical Q-without-U word, organised by length with points analysis and strategy tips for competitive play.",
    readTime: "5 min read",
  },
  {
    slug: "high-value-z-words",
    title: "High-Scoring Z Words: A Word Game Player's Guide",
    description:
      "The Z tile is worth 8 points — one of the highest in the game. Here are the best Z words to memorise, from three letters to seven.",
    readTime: "5 min read",
  },
  {
    slug: "seven-letter-words-to-know",
    title: "7-Letter Words Every Word Game Player Should Know",
    description:
      "Seven-letter words unlock the 3× multiplier in WordCherry. Learn the best patterns, anagram seeds, and specific words to add to your mental dictionary.",
    readTime: "6 min read",
  },
  {
    slug: "word-game-strategies",
    title: "Advanced Word Game Strategies: How Top Players Dominate",
    description:
      "Go beyond basic tips. This guide covers the mental frameworks, speed vs optimisation tradeoffs, and pattern recognition skills that separate top players from the rest.",
    readTime: "7 min read",
  },
]

export default function BlogIndexPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h1 className="text-2xl font-bold text-wordcherryBlue">Blog</h1>
        </div>
        <div className="bg-[#fff7d6] p-6 md:p-8">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Word game tips, vocabulary guides, high-scoring word lists, and the science behind why
            word games are good for you. Whether you want to climb the leaderboard or just enjoy the
            game more, these articles will help.
          </p>
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="block rounded-xl border border-wordcherryBlue/20 bg-white p-5 hover:border-wordcherryBlue/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-wordcherryBlue mb-1">{article.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400 mt-1">{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
