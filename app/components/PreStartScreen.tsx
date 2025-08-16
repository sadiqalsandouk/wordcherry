interface PreStartScreenProps {
  handleStartGame: () => void
}

export const PreStartScreen = ({ handleStartGame }: PreStartScreenProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
        <p className="text-gray-600 mb-6">Create words from your letter tiles and earn points!</p>
        <button
          onClick={handleStartGame}
          className="cursor-pointer w-full bg-applegramYellow text-applegramBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-applegramYellow/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-applegramYellow"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
