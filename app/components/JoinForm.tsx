"use client"
import { useState } from "react"

export default function JoinForm() {
  const [gameCode, setGameCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const isFormComplete = gameCode.trim() !== "" && playerName.trim() !== ""

  return (
    <div className="mx-auto max-w-sm px-4 mt-2 mb-8">
      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-applegramYellow py-3 px-4 text-center">
          <h2 className="text-2xl font-bold text-applegramBlue">
            PLAY WITH FRIENDS
          </h2>
        </div>

        <div className="bg-[#fff7d6] p-4 flex flex-col gap-4">
          <input
            type="text"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter game code"
            className="w-full p-3 text-center text-applegramBlue bg-[#fff7d6] placeholder:text-applegramBlue/70 outline-none border-b border-applegramYellow/30"
          />

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name"
            className="w-full p-3 text-center text-applegramBlue bg-[#fff7d6] placeholder:text-applegramBlue/70 outline-none border-b border-applegramYellow/30"
          />
        </div>

        <button
          disabled={!isFormComplete}
          className={`w-full py-4 text-2xl font-bold 
            ${
              !isFormComplete
                ? "bg-gray-400 text-gray-200"
                : "bg-applegramRed text-white"
            }`}
          onClick={() => {
            if (isFormComplete) {
              console.log(
                "Joining game with code:",
                gameCode,
                "and name:",
                playerName
              )
            }
          }}
        >
          JOIN GAME
        </button>
      </div>
    </div>
  )
}
