interface PreStartScreenProps {
  handleStartGame: () => void
}

export default function PreStartScreen({ handleStartGame }: PreStartScreenProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
      <div className="text-center space-y-6 md:space-y-8 lg:space-y-10">
        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 md:mb-8">
            Ready to Play?
          </h2>

          {/* Game Rules */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 md:mb-8 border border-gray-200">
            <div className="space-y-4 text-gray-700">
              <div className="text-lg sm:text-xl font-semibold">
                Start with <span className="text-wordcherryBlue font-bold">60 seconds</span>
              </div>
              <div className="text-lg sm:text-xl font-semibold">Build words from letter tiles</div>

              <div className="text-base sm:text-lg text-gray-600">
                Longer words and rare letters give bonus score and time
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="cursor-pointer w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl py-4 sm:py-5 md:py-6 lg:py-7 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200"
          >
            START GAME
          </button>

          <div className="mt-6 md:mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-wordcherryBlue">∞</div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-wordcherryBlue">Time</div>
              <div className="text-sm text-gray-600">Bonus</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-wordcherryBlue">Score</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
