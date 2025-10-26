import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"

export default function Home() {
  return (
    <div className="py-8">
      <div className="space-y-4 sm:space-y-4 md:space-y-6">
        <SoloButton />
        <div className="text-center text-white text-base sm:text-lg font-bold my-2 sm:my-4 opacity-70">
          - OR -
        </div>
        <JoinForm />

        {/* FAQ Section */}
        <div className="mt-8 md:mt-10">
          <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="bg-wordcherryYellow py-3 px-4 text-center">
              <h2 className="text-2xl font-bold text-wordcherryBlue">FAQ</h2>
            </div>

            <div className="bg-[#fff7d6] p-3 space-y-2">
              {/* How to Play FAQ */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-wordcherryBlue font-semibold hover:bg-wordcherryYellow/20 rounded-lg p-2 transition-colors">
                  <span>How do I play?</span>
                  <span className="transform transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-wordcherryBlue/30">
                  <div className="text-wordcherryBlue text-sm mb-3 font-bold">
                    Build words with letter tiles to score points and extend your time!
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-wordcherryBlue text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <span className="text-wordcherryBlue text-sm">
                        Start with 10 random tiles and build words to earn time
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-wordcherryBlue text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <span className="text-wordcherryBlue text-sm">
                        Click tiles or type to build words
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-wordcherryBlue text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <span className="text-wordcherryBlue text-sm">
                        Submit valid words to get new tiles and earn time bonuses
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-wordcherryBlue text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <span className="text-wordcherryBlue text-sm">
                        Longer words = more points and time!
                      </span>
                    </div>
                  </div>
                </div>
              </details>

              {/* Scoring FAQ */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-wordcherryBlue font-semibold hover:bg-wordcherryYellow/20 rounded-lg p-2 transition-colors">
                  <span>How does scoring work?</span>
                  <span className="transform transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-wordcherryBlue/30">
                  <div className="space-y-4">
                    <div>
                      <div className="text-wordcherryBlue font-semibold text-sm mb-2">
                        Letter Values
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-wordcherryYellow/20 rounded p-2 border border-wordcherryBlue/30">
                          <div className="text-gray-600 mb-2">Common (1pt)</div>
                          <div className="font-mono">E S I A R N T O</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-2 border border-wordcherryBlue/30">
                          <div className="text-gray-600 mb-2">Uncommon (2pt)</div>
                          <div className="font-mono">L C D U P M G</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-2 border border-wordcherryBlue/30">
                          <div className="text-gray-600 mb-2">Rare (3-5pt)</div>
                          <div className="font-mono">H B Y F V K W</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-2 border border-wordcherryBlue/30">
                          <div className="text-gray-600 mb-2">Very Rare (6-8pt)</div>
                          <div className="font-mono">Z X J Q</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-wordcherryBlue font-semibold text-sm mb-2">
                        Length Multipliers
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-xs">
                        <div className="bg-wordcherryYellow/20 rounded p-1 border border-wordcherryBlue/30 text-center">
                          <div className="text-gray-600">3</div>
                          <div className="font-bold text-wordcherryBlue">0.5x</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-1 border border-wordcherryBlue/30 text-center">
                          <div className="text-gray-600">4</div>
                          <div className="font-bold text-wordcherryBlue">1x</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-1 border border-wordcherryBlue/30 text-center">
                          <div className="text-gray-600">5-6</div>
                          <div className="font-bold text-wordcherryBlue">2x</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-1 border border-wordcherryBlue/30 text-center">
                          <div className="text-gray-600">7-8</div>
                          <div className="font-bold text-wordcherryBlue">3x</div>
                        </div>
                        <div className="bg-wordcherryYellow/20 rounded p-1 border border-wordcherryBlue/30 text-center">
                          <div className="text-gray-600">9+</div>
                          <div className="font-bold text-wordcherryBlue">4x</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-wordcherryBlue font-semibold text-sm mb-2">
                        Time Bonuses
                      </div>
                      <div className="bg-wordcherryYellow/20 rounded p-3 border border-wordcherryBlue/30 text-xs">
                        <div className="text-gray-600 mb-2">
                          Base time bonus + score-based bonus (up to 8s max)
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>3-4 letters:</span>
                            <span className="font-bold text-wordcherryBlue">+1s base</span>
                          </div>
                          <div className="flex justify-between">
                            <span>5-6 letters:</span>
                            <span className="font-bold text-wordcherryBlue">+2s base</span>
                          </div>
                          <div className="flex justify-between">
                            <span>7+ letters:</span>
                            <span className="font-bold text-wordcherryBlue">+2s base</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Score bonus:</span>
                            <span className="font-bold text-wordcherryBlue">15% of word score</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>

              {/* Tips FAQ */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-wordcherryBlue font-semibold hover:bg-wordcherryYellow/20 rounded-lg p-2 transition-colors">
                  <span>Any tips for scoring higher?</span>
                  <span className="transform transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-wordcherryBlue/30">
                  <div className="space-y-3">
                    <div className="bg-wordcherryYellow/20 rounded-lg p-3 border border-wordcherryBlue/30">
                      <div className="font-bold text-wordcherryBlue text-sm mb-1">
                        Target 5+ Letter Words
                      </div>
                      <div className="text-gray-600 text-xs">
                        Better time bonuses and point multipliers
                      </div>
                    </div>
                    <div className="bg-wordcherryYellow/20 rounded-lg p-3 border border-wordcherryBlue/30">
                      <div className="font-bold text-wordcherryBlue text-sm mb-1">
                        Use Rare Letters
                      </div>
                      <div className="text-gray-600 text-xs">
                        Q, J, X, Z give the most points and time
                      </div>
                    </div>
                    <div className="bg-wordcherryYellow/20 rounded-lg p-3 border border-wordcherryBlue/30">
                      <div className="font-bold text-wordcherryBlue text-sm mb-1">
                        Avoid 3-Letter Words
                      </div>
                      <div className="text-gray-600 text-xs">
                        Minimal rewards - use only these for survival
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
