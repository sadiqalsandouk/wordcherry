import { LucideIcon } from "lucide-react"

export enum GameState {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
  ENDED = "ended",
}

export enum Timer {
  RUNNING = "running",
  PAUSED = "paused",
  STOPPED = "stopped",
}

export type GameOverProps = {
  handleStartGame: () => void
  score: number
  bestWord: { word: string; score: number }
}

export type PerformanceLevel = {
  icon: LucideIcon
  title: string
  subtitle: string
  bgColor: string
  textColor: string
  showConfetti: boolean
  buttonColor: string
  buttonTextColor: string
}

export type SubmitScoreInput = {
  gameId: string
  score: number
  bestWord: string
  bestWordScore: number
  playerName: string
}

export type SubmitScoreResult = { ok: true } | { ok: false; error: string }

export type LeaderboardEntry = {
  id: string
  player_name: string
  score: number
  best_word: string
  best_word_score: number
  created_at: string
  is_anonymous: boolean
}

export type LeaderboardResult =
  | { ok: true; data: LeaderboardEntry[] }
  | { ok: false; error: string }

// ============================================
// Multiplayer Types
// ============================================

export type GameStatus = "lobby" | "in_progress" | "finished"
export type Team = "A" | "B"

export type Game = {
  id: string
  join_code: string
  host_user_id: string
  status: GameStatus
  seed: string
  duration_seconds: number
  max_players: number
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export type GamePlayer = {
  id: string
  game_id: string
  user_id: string
  player_name: string
  team: Team
  score: number
  best_word: string | null
  best_word_score: number
  is_ready?: boolean
  last_seen_at?: string | null
  joined_at: string
}

export type GameSubmission = {
  id: string
  game_id: string
  player_id: string
  word: string
  score: number
  round_index: number
  submitted_at: string
}

export type GameSummary = {
  game_id: string
  join_code: string
  status: GameStatus
  duration_seconds: number
  started_at: string | null
  ended_at: string | null
  player_count: number
  team_a_score: number
  team_b_score: number
  team_a_count: number
  team_b_count: number
}

// Multiplayer API Results
export type CreateGameResult =
  | { ok: true; gameId: string; joinCode: string }
  | { ok: false; error: string }

export type JoinGameResult =
  | { ok: true; gameId: string }
  | { ok: false; error: string }

export type StartGameResult =
  | { ok: true; startedAt: string }
  | { ok: false; error: string }

export type SubmitWordResult =
  | { ok: true; submissionId: string; newTotalScore: number }
  | { ok: false; error: string }

// Multiplayer Game State (client-side)
export type MultiplayerGameState = {
  game: Game | null
  players: GamePlayer[]
  currentPlayer: GamePlayer | null
  isHost: boolean
  isLoading: boolean
  error: string | null
}

// Realtime payload types
export type GameChangePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new: Game | null
  old: Game | null
}

export type PlayerChangePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new: GamePlayer | null
  old: GamePlayer | null
}

// Lobby settings (configurable by host)
export type LobbySettings = {
  durationSeconds: number
  maxPlayers: number
}
