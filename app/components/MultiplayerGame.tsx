"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Game, GamePlayer } from "@/app/types/types"
import { supabase } from "@/lib/supabase/supabase"
import { submitWord, endGame } from "@/lib/supabase/gameOperations"
import { getSeededLetters } from "@/app/utils/getSeededLetters"
import { validateWord } from "@/app/utils/wordValidation"
import { calculateFinalScore } from "@/app/utils/wordScoringSystem"
import TileRack from "./TileRack"
import CurrentWord from "./CurrentWord"
import SubmitButton from "./SubmitButton"
import PlayerList from "./PlayerList"
import MultiplayerGameEnd from "./MultiplayerGameEnd"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface TileState {
  letter: string
  isUsed: boolean
  usedInWordIndex?: number
}

type MultiplayerGameProps = {
  game: Game
  players: GamePlayer[]
  currentUserId: string
  startedAt: string
  onGameEnd: () => void
  onPlayersUpdate: (players: GamePlayer[]) => void
}

export default function MultiplayerGame({
  game,
  players: initialPlayers,
  currentUserId,
  startedAt,
  onGameEnd,
  onPlayersUpdate,
}: MultiplayerGameProps) {
  const [players, setPlayers] = useState<GamePlayer[]>(initialPlayers)
  const [tiles, setTiles] = useState<TileState[]>([])
  const [currentWord, setCurrentWord] = useState<{ letter: string; tileIndex: number }[]>([])
  const [score, setScore] = useState(0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(game.duration_seconds)
  const [isGameOver, setIsGameOver] = useState(game.status === "finished")
  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [bestWord, setBestWord] = useState<{ word: string; score: number }>({ word: "", score: 0 })
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const gameEndTimeRef = useRef<number | null>(null)

  // Get current player
  const currentPlayer = players.find((p) => p.user_id === currentUserId)

  // Initialize tiles from seed
  useEffect(() => {
    const letters = getSeededLetters(game.seed, roundIndex)
    setTiles(letters.map((letter) => ({ letter, isUsed: false })))
  }, [game.seed, roundIndex])

  // Calculate game end time once on mount
  useEffect(() => {
    // Game end time = started_at + duration (using server timestamp)
    const startTime = new Date(startedAt).getTime()
    const endTime = startTime + (game.duration_seconds * 1000)
    gameEndTimeRef.current = endTime
    
    // Set initial seconds left
    setSecondsLeft(game.duration_seconds)
  }, [startedAt, game.duration_seconds])

  // Simple countdown timer - decrements every second
  useEffect(() => {
    if (isGameOver) return

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const newValue = prev - 1
        
        if (newValue <= 0) {
          setIsGameOver(true)
          onGameEnd()
          endGame(game.id)
          return 0
        }
        
        return newValue
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [game.id, isGameOver, onGameEnd])

  // Subscribe to player score updates
  useEffect(() => {
    const channel = supabase.channel(`game_scores:${game.id}`)

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          const updatedPlayer = payload.new as GamePlayer
          setPlayers((prev) =>
            prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${game.id}`,
        },
        (payload) => {
          const updatedGame = payload.new as Game
          if (updatedGame.status === "finished") {
            setIsGameOver(true)
            onGameEnd()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [game.id, onGameEnd])

  // Notify parent of player updates (deferred to avoid updating during render)
  useEffect(() => {
    onPlayersUpdate(players)
  }, [players, onPlayersUpdate])

  // Update local score from current player
  useEffect(() => {
    if (currentPlayer) {
      setScore(currentPlayer.score)
      if (currentPlayer.best_word && currentPlayer.best_word_score > bestWord.score) {
        setBestWord({
          word: currentPlayer.best_word,
          score: currentPlayer.best_word_score,
        })
      }
    }
  }, [currentPlayer, bestWord.score])

  const handleTileClick = useCallback(
    (letter: string, index: number) => {
      if (tiles[index].isUsed || isGameOver) return

      setCurrentWord((prev) => [...prev, { letter, tileIndex: index }])
      setTiles((prev) =>
        prev.map((tile, i) =>
          i === index ? { ...tile, isUsed: true, usedInWordIndex: currentWord.length } : tile
        )
      )
    },
    [tiles, currentWord, isGameOver]
  )

  const handleCurrentWordClick = (letter: string, index: number) => {
    if (isGameOver) return
    
    const wordTile = currentWord[index]
    const tileIndex = wordTile.tileIndex

    setTiles((prev) =>
      prev.map((tile, i) =>
        i === tileIndex ? { ...tile, isUsed: false, usedInWordIndex: undefined } : tile
      )
    )

    setCurrentWord((prev) => prev.filter((_, currentPosition) => currentPosition !== index))
  }

  const handleBackspace = useCallback(() => {
    if (currentWord.length === 0 || isGameOver) return

    const lastWordTile = currentWord[currentWord.length - 1]
    const tileIndex = lastWordTile.tileIndex

    setTiles((prev) =>
      prev.map((tile, i) =>
        i === tileIndex ? { ...tile, isUsed: false, usedInWordIndex: undefined } : tile
      )
    )

    setCurrentWord((prev) => prev.slice(0, -1))
  }, [currentWord, isGameOver])

  const handleLetterType = useCallback(
    (letter: string) => {
      if (isGameOver) return
      
      const availableTileIndex = tiles.findIndex(
        (tile) => tile.letter.toLowerCase() === letter.toLowerCase() && !tile.isUsed
      )

      if (availableTileIndex !== -1) {
        handleTileClick(tiles[availableTileIndex].letter, availableTileIndex)
      }
    },
    [tiles, handleTileClick, isGameOver]
  )

  const handleSubmitButton = useCallback(async () => {
    if (isGameOver) return
    
    const currentWordString = currentWord.map((tile) => tile.letter).join("")
    const wordScore = calculateFinalScore(currentWordString)
    const isValid = validateWord(currentWordString)

    if (isValid) {
      // Submit word to server
      const result = await submitWord(game.id, currentWordString, wordScore, roundIndex)

      if (result.ok) {
        // Show feedback
        setFeedback(`+${wordScore} points!`)
        setShowFeedback(true)

        // Update local score immediately for responsiveness
        setScore(result.newTotalScore)

        if (wordScore > bestWord.score) {
          setBestWord({ word: currentWordString, score: wordScore })
        }

        // Clear word and get new letters
        setCurrentWord([])
        setRoundIndex((prev) => prev + 1)
      } else {
        // Handle duplicate or other error
        setFeedback(result.error || "Failed to submit")
        setShowFeedback(true)
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
      }
    } else {
      setFeedback("Invalid word!")
      setShowFeedback(true)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [currentWord, game.id, roundIndex, bestWord.score, isGameOver])

  const handlePause = useCallback(() => {
    // No pause in multiplayer - just show info toast
    toast.info("Cannot pause multiplayer games")
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver) return

      if (event.key === "Backspace") {
        event.preventDefault()
        handleBackspace()
      } else if (event.key === "Enter") {
        event.preventDefault()
        if (currentWord.length > 0) {
          handleSubmitButton()
        }
      } else if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault()
        handleLetterType(event.key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleBackspace, handleLetterType, handleSubmitButton, currentWord, isGameOver])

  // Game Over Screen
  if (isGameOver) {
    return (
      <MultiplayerGameEnd
        game={game}
        players={players}
        currentUserId={currentUserId}
        bestWord={bestWord}
      />
    )
  }

  // Calculate team scores
  const teamAScore = players.filter((p) => p.team === "A").reduce((sum, p) => sum + p.score, 0)
  const teamBScore = players.filter((p) => p.team === "B").reduce((sum, p) => sum + p.score, 0)

  // Format time as MM:SS
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  const progressPercentage = (secondsLeft / game.duration_seconds) * 100

  return (
    <div className="pt-4 md:pt-0">
      <div className="space-y-4 md:space-y-6">
        {/* Timer and Score Header */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="relative bg-wordcherryBlue p-4 rounded-lg">
            {/* Team Scores and Timer Row */}
            <div className="flex justify-between items-center">
              {/* Blue Team */}
              <div className="flex items-center gap-2">
                <span className="text-blue-300 font-bold text-sm">BLUE</span>
                <span className="text-white font-bold text-xl">{teamAScore}</span>
              </div>

              {/* Timer */}
              <div
                className={`text-white font-bold text-2xl ${
                  secondsLeft <= 5
                    ? "text-red-300 animate-pulse"
                    : secondsLeft <= 10
                    ? "text-orange-300"
                    : ""
                }`}
              >
                {timeDisplay}
              </div>

              {/* Red Team */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xl">{teamBScore}</span>
                <span className="text-red-300 font-bold text-sm">RED</span>
              </div>
            </div>

            {/* Your Score */}
            <div className="flex justify-center items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-wordcherryYellow" />
              <span className="text-wordcherryYellow font-bold text-sm">
                You: {score}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2">
              <div className="relative w-full h-full bg-gray-200/20 overflow-hidden rounded-b-lg">
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear bg-gradient-to-r from-red-500 to-yellow-400"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Word Area */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
          <div
            className={`bg-[#fff7d6] p-6 md:p-8 rounded-lg min-h-[150px] md:min-h-[180px] flex flex-col relative ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            {currentWord.length > 0 && (
              <button
                onClick={() => {
                  setCurrentWord([])
                  setTiles((prev) =>
                    prev.map((tile) => ({ ...tile, isUsed: false, usedInWordIndex: undefined }))
                  )
                }}
                className="cursor-pointer absolute bottom-3 right-3 px-2 py-1 md:px-3 md:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium rounded-lg border border-red-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 md:gap-1.5"
                title="Clear word"
              >
                <span className="text-xs md:text-sm">Clear</span>
              </button>
            )}
            <div className="flex-1 flex items-center justify-center">
              {currentWord.length === 0 ? (
                <div className="text-gray-400 text-lg md:text-xl italic text-center px-4">
                  <span className="block md:hidden">Tap letters to build words...</span>
                  <span className="hidden md:block">
                    Type or click letters to build words...
                  </span>
                </div>
              ) : (
                <CurrentWord
                  onTileClick={handleCurrentWordClick}
                  currentWord={currentWord.map((tile) => tile.letter)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div
              className={`px-6 py-2 rounded-lg font-bold text-white text-sm shadow-lg animate-fade-out ${
                feedback.startsWith("+") ? "bg-green-500" : "bg-red-500"
              }`}
              onAnimationEnd={() => {
                setShowFeedback(false)
                setFeedback("")
              }}
            >
              {feedback}
            </div>
          </div>
        )}

        {/* Tile Rack */}
        <div className="mt-6 md:mt-4">
          <TileRack
            onTileClick={handleTileClick}
            tiles={tiles}
            onBackspace={handleBackspace}
            onPause={handlePause}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4 md:mt-2">
          <SubmitButton
            onSubmitClick={handleSubmitButton}
            currentWord={currentWord.map((tile) => tile.letter)}
          />
        </div>

        {/* Live Player List */}
        <div className="w-full max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-[#fff7d6] rounded-xl p-3">
            <h3 className="text-sm font-bold text-wordcherryBlue mb-2 text-center">Live Scores</h3>
            <PlayerList
              players={players}
              currentUserId={currentUserId}
              hostUserId={game.host_user_id}
              isHost={false}
              gameStatus="in_progress"
            />
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
