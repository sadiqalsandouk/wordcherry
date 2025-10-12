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
  emoji: string
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
