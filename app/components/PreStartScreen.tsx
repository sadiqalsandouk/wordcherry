import { Play, Clock, Zap, Trophy } from "lucide-react"

interface PreStartScreenProps {
  handleStartGame: () => void
}

export default function PreStartScreen({ handleStartGame }: PreStartScreenProps) {
  return (
    <div className="py-8 w-full px-4 sm:px-0">
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto">
        {/* Header */}
        <div className="p-6 md:p-8 text-center border-b border-gray-100">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
            Solo Mode
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Race against the clock!
          </p>
        </div>

        {/* Game info */}
        <div className="p-6 md:p-8 space-y-4">
          {/* Starting time */}
          <div className="flex items-center gap-4 p-4 bg-wordcherryBlue/5 rounded-xl">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-wordcherryBlue/10 flex items-center justify-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-wordcherryBlue" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Starting Time</div>
              <div className="text-lg md:text-xl font-bold text-gray-800">30 seconds</div>
            </div>
          </div>

          {/* Time bonus */}
          <div className="flex items-center gap-4 p-4 bg-wordcherryYellow/10 rounded-xl">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-wordcherryYellow/20 flex items-center justify-center">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Time Bonuses</div>
              <div className="text-lg md:text-xl font-bold text-gray-800">Earn time with each word!</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="flex items-center gap-4 p-4 bg-wordcherryRed/5 rounded-xl">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-wordcherryRed/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-wordcherryRed" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Compete</div>
              <div className="text-lg md:text-xl font-bold text-gray-800">Score saved to leaderboard</div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="p-4 md:p-6 pt-0">
          <button
            onClick={handleStartGame}
            className="cursor-pointer w-full py-4 md:py-5 rounded-xl text-lg md:text-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-wordcherryBlue to-cyan-500 text-white shadow-lg shadow-wordcherryBlue/30 hover:shadow-xl hover:shadow-wordcherryBlue/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6" />
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}
