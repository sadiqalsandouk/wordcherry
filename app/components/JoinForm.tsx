"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createGame } from "@/lib/supabase/createGame"
import { joinGame } from "@/lib/supabase/joinGame"
import { usePlayerName } from "./AuthProvider"
import { toast } from "sonner"
import { Loader2, User } from "lucide-react"

export default function JoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { playerName: authPlayerName, isLoading: authLoading } = usePlayerName()
  
  const [gameCode, setGameCode] = useState("")
  const [mode, setMode] = useState<"join" | "create">("join")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill game code from URL parameter
  useEffect(() => {
    const joinCode = searchParams.get("join")
    if (joinCode) {
      setGameCode(joinCode.toUpperCase())
      setMode("join")
    }
  }, [searchParams])

  const isFormComplete =
    mode === "join" 
      ? gameCode.trim().length === 6 && !authLoading
      : !authLoading

  const handleSubmit = async () => {
    if (!isFormComplete || isSubmitting) return

    setIsSubmitting(true)

    try {
      if (mode === "join") {
        const result = await joinGame(gameCode.trim(), authPlayerName)
        
        if (result.ok) {
          toast.success("Joined game!")
          router.push(`/game/${gameCode.toUpperCase()}`)
        } else {
          toast.error(result.error || "Failed to join game")
        }
      } else {
        const result = await createGame(authPlayerName)
        
        if (result.ok) {
          toast.success(`Game created! Code: ${result.joinCode}`)
          router.push(`/game/${result.joinCode}`)
        } else {
          toast.error(result.error || "Failed to create game")
        }
      }
    } catch (error) {
      console.error("Form submit error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormComplete && !isSubmitting) {
      handleSubmit()
    }
  }

  return (
    <div>
      <div className="bg-wordcherryBlue/30 backdrop-blur-sm rounded-full flex mb-4 sm:mb-6 shadow-inner mx-4 sm:mx-8 md:mx-12">
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

        <div className="bg-[#fff7d6] p-4 flex flex-col gap-4 min-h-[100px]">
          {/* Game code input - only show for join mode */}
          <div className={`transition-all duration-300 ease-in-out ${
            mode === "join" 
              ? "max-h-16 opacity-100" 
              : "max-h-0 opacity-0 overflow-hidden"
          }`}>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase().slice(0, 6))}
              onKeyDown={handleKeyDown}
              placeholder="Enter game code"
              maxLength={6}
              className="w-full p-3 text-center text-wordcherryBlue bg-[#fff7d6] placeholder:text-wordcherryBlue/70 outline-none border-b border-wordcherryYellow/30 font-mono text-xl tracking-widest uppercase"
            />
          </div>

          {/* Player name display (non-editable) */}
          <div className="flex items-center justify-center gap-2 py-2">
            <User className="w-5 h-5 text-wordcherryBlue/60" />
            <span className="text-wordcherryBlue font-medium">
              {authLoading ? "Loading..." : authPlayerName}
            </span>
          </div>
        </div>

        <button
          disabled={!isFormComplete || isSubmitting}
          className={`w-full py-4 text-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2
            ${
              !isFormComplete || isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-wordcherryRed text-white hover:scale-103 active:scale-95 cursor-pointer"
            }`}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {mode === "join" ? "JOINING..." : "CREATING..."}
            </>
          ) : (
            mode === "join" ? "JOIN GAME" : "CREATE GAME"
          )}
        </button>
      </div>
    </div>
  )
}
