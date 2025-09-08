interface PreStartScreenProps {
  handleStartGame: () => void
}

export default function PreStartScreen({ handleStartGame }: PreStartScreenProps) {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gray-100 p-8 rounded-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">🍎</h1>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to
            <br />
            Wordcherry!
          </h2>

          <div className="space-y-2 text-gray-700 text-lg leading-relaxed">
            <p>
              You have <span className="font-semibold text-wordcherryBlue">60 seconds</span>.
            </p>
            <p>Build words. Score big.</p>
            <p>Beat your best!</p>
          </div>
        </div>
        <button
          onClick={handleStartGame}
          className="cursor-pointer w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryYellow transition-all duration-200"
        >
          START GAME
        </button>
      </div>
    </div>
  )
}
