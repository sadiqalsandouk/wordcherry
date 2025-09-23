import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"
import Title from "./components/Title"

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <Title />
      <div className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6 md:space-y-8">
        <SoloButton />
        <div className="text-center text-white text-base sm:text-lg font-bold my-2 sm:my-4 opacity-70">
          - OR -
        </div>
        <JoinForm />

        {/* How to Play Section */}
        <div className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="bg-wordcherryYellow py-3 px-4 text-center">
              <h2 className="text-2xl font-bold text-wordcherryBlue">HOW TO PLAY</h2>
            </div>

            {/* Content */}
            <div className="bg-[#fff7d6] p-6 md:p-8">
              {/* Gameplay Steps */}
              <div className="mb-8">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-wordcherryBlue text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <span className="text-gray-700">
                      Start with <strong>60 seconds</strong> and 10 random letter tiles
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-wordcherryBlue text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <span className="text-gray-700">
                      Click tiles or type letters to build words
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-wordcherryBlue text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <span className="text-gray-700">
                      Press Enter or click Submit to validate your word
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-wordcherryBlue text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      4
                    </span>
                    <span className="text-gray-700">
                      Get new tiles after each valid word and keep building
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-wordcherryBlue text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      5
                    </span>
                    <span className="text-gray-700">Survive as long as possible!</span>
                  </div>
                </div>
              </div>

              {/* Scoring System */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-wordcherryBlue mb-4">Scoring System</h3>

                {/* Letter Values */}
                <div className="mb-6 max-w-md mx-auto">
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg">
                    <div className="font-bold text-wordcherryBlue mb-3">Letter Values</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Common letters (E, A, R, S, I, N, T, O):
                        </span>
                        <span className="font-bold text-wordcherryBlue">1 point</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Uncommon letters (L, C, D, U, P, M, G):
                        </span>
                        <span className="font-bold text-wordcherryBlue">2 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rare letters (H, B, Y, F, V, K, W):</span>
                        <span className="font-bold text-wordcherryBlue">3-5 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Very rare letters (Z, X, J, Q):</span>
                        <span className="font-bold text-wordcherryBlue">6-8 points</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Length Multipliers */}
                <div className="mb-6 max-w-md mx-auto">
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg">
                    <div className="font-bold text-wordcherryBlue mb-3">Length Multipliers</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">3 letters:</span>
                        <span className="font-bold text-wordcherryBlue">0.5x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">4 letters:</span>
                        <span className="font-bold text-wordcherryBlue">1x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">5-6 letters:</span>
                        <span className="font-bold text-wordcherryBlue">2x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">7-8 letters:</span>
                        <span className="font-bold text-wordcherryBlue">3x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">9+ letters:</span>
                        <span className="font-bold text-wordcherryBlue">4x</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Bonuses */}
                <div className="mb-6 max-w-md mx-auto">
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg">
                    <div className="font-bold text-wordcherryBlue mb-3">Time Bonuses</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">3 letters:</span>
                        <span className="font-bold text-wordcherryBlue">+1 second</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">4 letters:</span>
                        <span className="font-bold text-wordcherryBlue">+2 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">5-6 letters:</span>
                        <span className="font-bold text-wordcherryBlue">+3 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">7+ letters:</span>
                        <span className="font-bold text-wordcherryBlue">+4 seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Tips */}
              <div>
                <h3 className="text-xl font-bold text-wordcherryBlue mb-4">Tips</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg border-2 border-wordcherryYellow/30">
                    <div className="font-bold text-wordcherryBlue mb-2">🎯 Target Length</div>
                    <div className="text-sm text-gray-700">
                      Aim for 5+ letter words for better time bonuses and points
                    </div>
                  </div>
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg border-2 border-wordcherryYellow/30">
                    <div className="font-bold text-wordcherryBlue mb-2">⚡ Hunt Rare Letters</div>
                    <div className="text-sm text-gray-700">
                      Q, J, X, Z give the most points and time
                    </div>
                  </div>
                  <div className="bg-wordcherryYellow/30 p-4 rounded-lg border-2 border-wordcherryYellow/30">
                    <div className="font-bold text-wordcherryBlue mb-2">🚫 Avoid Short Words</div>
                    <div className="text-sm text-gray-700">
                      3-letter words give minimal rewards - use only for survival
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
