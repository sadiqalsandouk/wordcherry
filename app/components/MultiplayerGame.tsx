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
import MultiplayerGameEnd from "./MultiplayerGameEnd"
import { Star } from "lucide-react"
import { sfx } from "@/app/utils/sfx"

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
  onBackToLobby?: () => void
  onPlayAgain?: () => void
  isActionLoading?: boolean
}

export default function MultiplayerGame({
  game,
  players: initialPlayers,
  currentUserId,
  startedAt,
  onGameEnd,
  onPlayersUpdate,
  onBackToLobby,
  onPlayAgain,
  isActionLoading = false,
}: MultiplayerGameProps) {
  const [players, setPlayers] = useState<GamePlayer[]>(initialPlayers)
  const [tiles, setTiles] = useState<TileState[]>([])
  const [currentWord, setCurrentWord] = useState<{ letter: string; tileIndex: number }[]>([])
  const [score, setScore] = useState(0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(game.duration_seconds)
  const [isGameOver, setIsGameOver] = useState(game.status === "finished")
  const [isLoadingFinalScores, setIsLoadingFinalScores] = useState(false)
  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [bestWord, setBestWord] = useState<{ word: string; score: number }>({ word: "", score: 0 })
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const gameEndTimeRef = useRef<number | null>(null)
  const lastTickRef = useRef<number | null>(null)
  const hasPlayedEndRef = useRef(false)

  // Ref to store final local score for merging
  const finalLocalScoreRef = useRef<number>(0)

  // Keep the ref updated with current score
  useEffect(() => {
    finalLocalScoreRef.current = score
  }, [score])

  // Fetch fresh player scores from database
  const fetchFinalScores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("game_players")
        .select("*")
        .eq("game_id", game.id)
      
      if (error) {
        console.error("Error fetching final scores:", error)
        return
      }
      
      if (data) {
        // Merge in the local score for current player in case DB hasn't synced yet
        const playersWithLocalScore = (data as GamePlayer[]).map(p => {
          if (p.user_id === currentUserId) {
            // Use the higher of local or DB score (in case local is ahead)
            return { ...p, score: Math.max(p.score, finalLocalScoreRef.current) }
          }
          return p
        })
        setPlayers(playersWithLocalScore)
      }
    } catch (err) {
      console.error("Failed to fetch final scores:", err)
    }
  }, [game.id, currentUserId])

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
    
    // Set initial seconds left based on server start time
    const initialLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
    setSecondsLeft(initialLeft)
  }, [startedAt, game.duration_seconds])

  // Broadcast final score to other players
  const broadcastFinalScore = useCallback(async () => {
    const channel = supabase.channel(`final_scores:${game.id}`)
    await channel.subscribe()
    await channel.send({
      type: "broadcast",
      event: "final_score",
      payload: {
        playerId: currentPlayer?.id,
        userId: currentUserId,
        score: finalLocalScoreRef.current,
      },
    })
    // Keep channel open briefly to ensure message is sent
    await new Promise(resolve => setTimeout(resolve, 200))
    supabase.removeChannel(channel)
  }, [game.id, currentPlayer?.id, currentUserId])

  // Handle game end - fetch final scores then show results
  const handleGameEnd = useCallback(async () => {
    setIsLoadingFinalScores(true)
    
    // Broadcast our final score to other players
    await broadcastFinalScore()
    
    // End game on server
    await endGame(game.id)
    
    // Wait for pending score updates to sync, then fetch fresh data
    // Longer wait to allow other players' broadcasts and DB writes
    await new Promise(resolve => setTimeout(resolve, 1500))
    await fetchFinalScores()
    
    // Double-check with another fetch after a short delay
    await new Promise(resolve => setTimeout(resolve, 500))
    await fetchFinalScores()
    
    setIsLoadingFinalScores(false)
    setIsGameOver(true)
  }, [game.id, fetchFinalScores, broadcastFinalScore])

  // Countdown timer synced to server start time
  useEffect(() => {
    if (isGameOver || isLoadingFinalScores) return

    timerRef.current = setInterval(() => {
      const endTime = gameEndTimeRef.current
      if (!endTime) return
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        handleGameEnd()
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [game.id, isGameOver, isLoadingFinalScores, handleGameEnd])

  // Notify parent when game is over (in useEffect to avoid setState during render)
  useEffect(() => {
    if (isGameOver) {
      onGameEnd()
    }
  }, [isGameOver, onGameEnd])

  useEffect(() => {
    if (!isGameOver) return
    if (hasPlayedEndRef.current) return
    hasPlayedEndRef.current = true
    sfx.end()
  }, [isGameOver])

  // Listen for other players' final score broadcasts
  useEffect(() => {
    const channel = supabase.channel(`final_scores:${game.id}`)
    
    channel
      .on("broadcast", { event: "final_score" }, (payload) => {
        const { userId, score: finalScore } = payload.payload
        
        // Update players array with the broadcast score
        setPlayers((prev) =>
          prev.map((p) => {
            if (p.user_id === userId) {
              // Use the higher score (broadcast might arrive before DB sync)
              return { ...p, score: Math.max(p.score, finalScore) }
            }
            return p
          })
        )
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [game.id])

  // Ref to store the live scores channel and its ready state
  const liveScoresChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [liveScoresReady, setLiveScoresReady] = useState(false)

  // Subscribe to live score broadcasts from other players
  useEffect(() => {
    // Use a unique but consistent channel name for the game
    const channelName = `live-scores-${game.id}`
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }, // Don't receive our own broadcasts
      },
    })

    channel
      .on("broadcast", { event: "score_update" }, (payload) => {
        const { playerId, userId, newScore, team } = payload.payload
        
        console.log("Received score update:", { playerId, userId, newScore, team })
        
        setPlayers((prev) => {
          console.log("Current players count:", prev.length)
          
          // First check if this player exists in our array
          const existingPlayerIndex = prev.findIndex(
            (p) => p.id === playerId || p.user_id === userId
          )
          
          if (existingPlayerIndex !== -1) {
            // Player found - update their score
            console.log("Found player, updating score")
            return prev.map((p, i) => 
              i === existingPlayerIndex ? { ...p, score: newScore } : p
            )
          }
          
          // Player not found by ID - try to find by team
          const teamPlayerIndex = prev.findIndex(
            (p) => p.team === team && p.user_id !== currentUserId
          )
          
          if (teamPlayerIndex !== -1) {
            console.log("Found by team, updating score")
            return prev.map((p, i) =>
              i === teamPlayerIndex ? { ...p, score: newScore } : p
            )
          }
          
          // No matching player found - add a placeholder player for this team
          console.log("No matching player found, adding placeholder for team:", team)
          const newPlayer: GamePlayer = {
            id: playerId || `temp-${Date.now()}`,
            game_id: game.id,
            user_id: userId || "",
            player_name: `Team ${team === "A" ? "Blue" : "Red"} Player`,
            team: team as "A" | "B",
            score: newScore,
            best_word: null,
            best_word_score: 0,
            joined_at: new Date().toISOString(),
          }
          return [...prev, newPlayer]
        })
      })
      .subscribe((status) => {
        console.log("Live scores channel status:", status)
        if (status === "SUBSCRIBED") {
          setLiveScoresReady(true)
        }
      })

    liveScoresChannelRef.current = channel

    return () => {
      setLiveScoresReady(false)
      supabase.removeChannel(channel)
    }
  }, [game.id, currentUserId])

  // Subscribe to game and player changes via postgres
  useEffect(() => {
    const channel = supabase.channel(`game_room:${game.id}`)

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${game.id}`,
        },
        async (payload) => {
          const updatedGame = payload.new as Game
          if (updatedGame.status === "finished" && !isGameOver) {
            // Another player ended the game - fetch final scores
            setIsLoadingFinalScores(true)
            await new Promise(resolve => setTimeout(resolve, 500))
            await fetchFinalScores()
            setIsLoadingFinalScores(false)
            setIsGameOver(true)
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          // New player joined - add them to our list
          const newPlayer = payload.new as GamePlayer
          console.log("New player joined:", newPlayer.player_name)
          setPlayers((prev) => {
            // Don't add if already exists
            if (prev.some(p => p.id === newPlayer.id)) return prev
            return [...prev, newPlayer]
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          // Player updated (score change from DB)
          const updatedPlayer = payload.new as GamePlayer
          setPlayers((prev) =>
            prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [game.id, isGameOver, fetchFinalScores])

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
      // Optimistic local update for instant feel
      const nextTotalScore = score + wordScore

      setFeedback(`+${wordScore} points!`)
      setShowFeedback(true)
      setScore(nextTotalScore)
      setPlayers((prev) =>
        prev.map((p) =>
          p.user_id === currentUserId ? { ...p, score: nextTotalScore } : p
        )
      )

      if (wordScore > bestWord.score) {
        setBestWord({ word: currentWordString, score: wordScore })
      }

      // Clear word and get new letters
      setCurrentWord([])
      setRoundIndex((prev) => prev + 1)

      // Submit to server in background (authoritative score comes from DB at game end)
      void submitWord(game.id, currentWordString, wordScore, roundIndex).then((result) => {
        if (!result.ok) {
          console.warn("Submit word rejected by server:", result.error)
        }
      })

      // Broadcast optimistic score update to other players
      if (liveScoresChannelRef.current && liveScoresReady) {
        console.log("Broadcasting score update:", nextTotalScore)
        liveScoresChannelRef.current.send({
          type: "broadcast",
          event: "score_update",
          payload: {
            playerId: currentPlayer?.id,
            userId: currentUserId,
            newScore: nextTotalScore,
            team: currentPlayer?.team,
          },
        }).then((result) => {
          console.log("Score broadcast result:", result)
        }).catch((err) => {
          console.error("Score broadcast failed:", err)
        })
      } else {
        console.warn("Live scores channel not ready:", { channel: !!liveScoresChannelRef.current, ready: liveScoresReady })
      }
    } else {
      setFeedback("Invalid word!")
      setShowFeedback(true)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [currentWord, game.id, roundIndex, bestWord.score, isGameOver, currentPlayer?.id, currentUserId, liveScoresReady])


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

  useEffect(() => {
    if (isGameOver || isLoadingFinalScores) return
    if (secondsLeft <= 0 || secondsLeft > 5) return
    if (lastTickRef.current === secondsLeft) return
    lastTickRef.current = secondsLeft
    sfx.tick()
  }, [secondsLeft, isGameOver, isLoadingFinalScores])

  // Loading final scores
  if (isLoadingFinalScores) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-white text-xl font-bold mb-4">Game Over!</div>
        <div className="text-white/70">Loading final scores...</div>
      </div>
    )
  }

  // Game Over Screen
  if (isGameOver) {
    const isHost = game.host_user_id === currentUserId
    return (
      <MultiplayerGameEnd
        game={game}
        players={players}
        currentUserId={currentUserId}
        bestWord={bestWord}
        onBackToLobby={onBackToLobby || (() => {})}
        onPlayAgain={onPlayAgain || (() => {})}
        isLoading={isActionLoading}
        isHost={isHost}
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
        {/* Timer and Team Scores Header */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="relative bg-wordcherryBlue p-4 md:p-6 rounded-xl">
            {/* Team Scores and Timer Row */}
            <div className="flex justify-between items-center">
              {/* Blue Team */}
              <div className="flex flex-col items-center bg-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-lg min-w-[80px] md:min-w-[100px]">
                <span className="text-blue-100 font-bold text-xs md:text-sm uppercase tracking-wide">Blue</span>
                <span className="text-white font-black text-3xl md:text-4xl">{teamAScore}</span>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center">
                <div
                  className={`font-black text-4xl md:text-5xl ${
                    secondsLeft <= 5
                      ? "text-red-300 animate-pulse"
                      : secondsLeft <= 10
                      ? "text-orange-300"
                      : "text-white"
                  }`}
                >
                  {timeDisplay}
                </div>
                {/* Your Score */}
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-wordcherryYellow" />
                  <span className="text-wordcherryYellow font-bold text-sm">
                    You: {score}
                  </span>
                </div>
              </div>

              {/* Red Team */}
              <div className="flex flex-col items-center bg-red-500 px-4 py-2 md:px-6 md:py-3 rounded-lg min-w-[80px] md:min-w-[100px]">
                <span className="text-red-100 font-bold text-xs md:text-sm uppercase tracking-wide">Red</span>
                <span className="text-white font-black text-3xl md:text-4xl">{teamBScore}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2">
              <div className="relative w-full h-full bg-gray-200/20 overflow-hidden rounded-b-xl">
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
            team={currentPlayer?.team}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4 md:mt-2">
          <SubmitButton
            onSubmitClick={handleSubmitButton}
            currentWord={currentWord.map((tile) => tile.letter)}
          />
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
