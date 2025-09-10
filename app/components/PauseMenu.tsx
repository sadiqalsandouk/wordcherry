"use client"

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onQuit: () => void
}

export default function PauseMenu({ onResume, onRestart, onQuit }: PauseMenuProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only resume if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onResume()
    }
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-lg bg-black/10 flex items-center justify-center z-50 cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-gray-200/50 cursor-default">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Paused</h2>

          <div className="space-y-3">
            <button
              onClick={onResume}
              className="w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              ▶️ Resume Game
            </button>

            <button
              onClick={onRestart}
              className="w-full bg-wordcherryBlue text-white font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryBlue/90 hover:scale-103 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              🔄 Restart Game
            </button>

            <button
              onClick={onQuit}
              className="w-full bg-gray-500 text-white font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-gray-600 hover:scale-103 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              🏠 Quit to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
