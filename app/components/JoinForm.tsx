"use client"
import { useState } from "react"

export default function JoinForm() {
  const [gameCode, setGameCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [mode, setMode] = useState("join")
  const isFormComplete =
    mode === "join" ? gameCode.trim() !== "" && playerName.trim() !== "" : playerName.trim() !== ""

  return (
    <div>
      <div className="bg-wordcherryBlue/30 backdrop-blur-sm rounded-full flex mb-6 shadow-inner mx-12 ">
        <button
          className={`cursor-pointer flex-1 py-1.5 px-4 text-center font-bold rounded-full transition-all duration-200 hover:scale-103 active:scale-95 ${
            mode === "join"
              ? "bg-wordcherryYellow text-wordcherryBlue shadow-sm"
              : "bg-transparent text-white"
          }`}
          onClick={() => setMode("join")}
        >
          Join
        </button>
        <button
          className={`cursor-pointer flex-1 py-1.5 px-4 text-center font-bold rounded-full transition-all duration-200 hover:scale-103 active:scale-95 ${
            mode === "create"
              ? "bg-wordcherryYellow text-wordcherryBlue shadow-sm"
              : "bg-transparent text-white"
          }`}
          onClick={() => setMode("create")}
        >
          Create
        </button>
      </div>

      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h2 className="text-2xl font-bold text-wordcherryBlue">
            {mode === "join" ? "JOIN A GAME" : "HOST A GAME"}
          </h2>
        </div>

        <div className="bg-[#fff7d6] p-4 flex flex-col gap-4">
          {mode === "join" && (
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter game code"
              className="w-full p-3 text-center text-wordcherryBlue bg-[#fff7d6] placeholder:text-wordcherryBlue/70 outline-none border-b border-wordcherryYellow/30"
            />
          )}

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name"
            className="w-full p-3 text-center text-wordcherryBlue bg-[#fff7d6] placeholder:text-wordcherryBlue/70 outline-none border-b border-wordcherryYellow/30"
          />
        </div>

        <button
          disabled={!isFormComplete}
          className={`w-full py-4 text-2xl font-bold transition-all duration-200 
            ${
              !isFormComplete
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-wordcherryRed text-white hover:scale-103 active:scale-95 cursor-pointer"
            }`}
          onClick={() => {
            if (isFormComplete) {
              if (mode === "join") {
                console.log("Joining game with code:", gameCode, "and name:", playerName)
              } else {
                console.log("Creating new game with host:", playerName)
              }
            }
          }}
        >
          {mode === "join" ? "JOIN GAME" : "CREATE GAME"}
        </button>
      </div>
    </div>
  )
}
