interface PreStartScreenProps {
  handleStartGame: () => void
}

export default function PreStartScreen({ handleStartGame }: PreStartScreenProps) {
  return (
    <div className="relative min-h-screen pt-16">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 rounded-2xl shadow-xl border border-gray-200 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 md:mb-8">
            Ready to Play?
          </h2>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 md:mb-8 border border-gray-200">
            <div className="space-y-4 text-gray-700">
              <div className="text-lg sm:text-xl font-semibold">
                Start with <span className="text-wordcherryBlue font-bold">30 seconds</span>
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
        </div>
      </div>
    </div>
  )
}
