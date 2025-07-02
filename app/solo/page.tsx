import GameBoard from "../components/GameBoard"

export default function SoloPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-applegramBlue p-8">
      <div className="w-[800px] bg-white rounded-xl shadow-lg p-6">
        <GameBoard />
      </div>
    </div>
  )
}
