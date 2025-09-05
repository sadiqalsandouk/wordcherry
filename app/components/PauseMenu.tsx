"use client"

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onQuit: () => void
}

export default function PauseMenu({ onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-gray-200/50">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Paused</h2>

          <div className="space-y-3">
            <button
              onClick={onResume}
              className="w-full bg-applegramYellow text-applegramBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-applegramYellow/90 transition-all duration-200"
            >
              ▶️ Resume Game
            </button>

            <button
              onClick={onRestart}
              className="w-full bg-applegramBlue text-white font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-applegramBlue/90 transition-all duration-200"
            >
              🔄 Restart Game
            </button>

            <button
              onClick={onQuit}
              className="w-full bg-gray-500 text-white font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-gray-600 transition-all duration-200"
            >
              🏠 Quit to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
