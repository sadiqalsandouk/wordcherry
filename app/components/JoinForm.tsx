"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createGame } from "@/lib/supabase/createGame"
import { joinGame } from "@/lib/supabase/joinGame"
import { usePlayerName } from "./AuthProvider"
import { toast } from "sonner"
import { Loader2, User, Users, Gamepad2 } from "lucide-react"

export default function JoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { playerName: authPlayerName, isLoading: authLoading } = usePlayerName()
  
  const [gameCode, setGameCode] = useState("")
  const [mode, setMode] = useState<"solo" | "join" | "create">("solo")
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
    mode === "solo"
      ? true
      : mode === "join" 
        ? gameCode.trim().length === 6 && !authLoading
        : !authLoading

  const handleSubmit = async () => {
    if (!isFormComplete || isSubmitting) return

    if (mode === "solo") {
      router.push("/solo")
      return
    }

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
      {/* Mode selector tabs */}
      <div className="bg-wordcherryBlue/30 backdrop-blur-sm rounded-full flex mb-4 sm:mb-6 shadow-inner mx-2 sm:mx-4">
        <button
          className={`cursor-pointer flex-1 py-2 px-2 sm:px-4 text-center font-bold rounded-full transition-all duration-200 hover:scale-103 active:scale-95 flex items-center justify-center gap-1.5 ${
            mode === "solo"
              ? "bg-wordcherryYellow text-wordcherryBlue shadow-sm"
              : "bg-transparent text-white"
          }`}
          onClick={() => setMode("solo")}
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-sm sm:text-base">Solo</span>
        </button>
        <button
          className={`cursor-pointer flex-1 py-2 px-2 sm:px-4 text-center font-bold rounded-full transition-all duration-200 hover:scale-103 active:scale-95 flex items-center justify-center gap-1.5 ${
            mode === "join"
              ? "bg-wordcherryYellow text-wordcherryBlue shadow-sm"
              : "bg-transparent text-white"
          }`}
          onClick={() => setMode("join")}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm sm:text-base">Join</span>
        </button>
        <button
          className={`cursor-pointer flex-1 py-2 px-2 sm:px-4 text-center font-bold rounded-full transition-all duration-200 hover:scale-103 active:scale-95 flex items-center justify-center gap-1.5 ${
            mode === "create"
              ? "bg-wordcherryYellow text-wordcherryBlue shadow-sm"
              : "bg-transparent text-white"
          }`}
          onClick={() => setMode("create")}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm sm:text-base">Create</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-wordcherryYellow py-3 px-4 text-center">
          <h2 className="text-2xl font-bold text-wordcherryBlue">
            {mode === "solo" ? "SOLO MODE" : mode === "join" ? "JOIN A GAME" : "HOST A GAME"}
          </h2>
        </div>

        <div className="bg-[#fff7d6] p-4 flex flex-col min-h-[80px]">
          {/* Solo mode content - with smooth transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mode === "solo" 
              ? "max-h-20 opacity-100" 
              : "max-h-0 opacity-0"
          }`}>
            <div className="text-center py-2">
              <p className="text-wordcherryBlue/80 text-sm">
                Play by yourself, earn time bonuses for valid words!
              </p>
            </div>
          </div>

          {/* Game code input - with smooth transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mode === "join" 
              ? "max-h-20 opacity-100" 
              : "max-h-0 opacity-0"
          }`}>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase().slice(0, 6))}
              onKeyDown={handleKeyDown}
              placeholder="Enter 6-digit game code"
              maxLength={6}
              className="w-full p-3 text-center text-wordcherryBlue bg-[#fff7d6] placeholder:text-wordcherryBlue/50 outline-none border-b border-wordcherryYellow/30 font-mono text-xl tracking-widest uppercase"
            />
          </div>

          {/* Create mode content - with smooth transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mode === "create" 
              ? "max-h-20 opacity-100" 
              : "max-h-0 opacity-0"
          }`}>
            <div className="text-center py-2">
              <p className="text-wordcherryBlue/80 text-sm">
                Create a lobby and invite friends with a code!
              </p>
            </div>
          </div>

          {/* Player name display - shown for all modes */}
          <div className="text-center py-1 mt-2">
            {authLoading ? (
              <span className="text-wordcherryBlue/60 text-sm">Loading...</span>
            ) : authPlayerName.startsWith("Guest-") ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-wordcherryBlue/50" />
                  <span className="text-sm text-wordcherryBlue/70">Playing as</span>
                  <span className="text-sm font-semibold text-wordcherryBlue">{authPlayerName}</span>
                </div>
                <a 
                  href="/account" 
                  className="text-xs text-wordcherryBlue/60 hover:text-wordcherryBlue underline underline-offset-2"
                >
                  Sign up to customize your name
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4 text-wordcherryBlue/50" />
                <span className="text-sm text-wordcherryBlue/70">Playing as</span>
                <span className="text-sm font-semibold text-wordcherryBlue">{authPlayerName}</span>
              </div>
            )}
          </div>
        </div>

        <button
          disabled={!isFormComplete || isSubmitting}
          className={`w-full py-4 text-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2
            ${
              !isFormComplete || isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : mode === "solo"
                  ? "bg-wordcherryYellow text-wordcherryBlue hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 cursor-pointer"
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
            mode === "solo" ? "PLAY SOLO" : mode === "join" ? "JOIN GAME" : "CREATE GAME"
          )}
        </button>
      </div>
    </div>
  )
}
