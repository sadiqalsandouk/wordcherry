// Time bonus system based on word quality
import { calculateFinalScore } from "./wordScoringSystem"

// Base time bonus constants (in seconds)
const BASE_TIME_BONUS = 1 // Minimum time bonus for any valid word
const SCORE_MULTIPLIER = 0.15 // Convert score points to time bonus seconds (reduced from 0.3)

// Bonus categories based on word score ranges
export const getTimeBonusCategory = (score: number): string => {
  if (score >= 30) return "Legendary"
  if (score >= 20) return "Excellent"
  if (score >= 15) return "Great"
  if (score >= 10) return "Good"
  if (score >= 5) return "Nice"
  return "Valid"
}

// Calculate time bonus based on word score and length
export const calculateTimeBonus = (word: string): number => {
  const wordScore = calculateFinalScore(word)

  // Different base bonuses based on word length (reduced across the board)
  let baseBonus = BASE_TIME_BONUS
  if (word.length >= 7) {
    baseBonus = 2 // 7+ letters: +2 seconds base (reduced from 4)
  } else if (word.length >= 5) {
    baseBonus = 2 // 5-6 letters: +2 seconds base (reduced from 3)
  } else {
    baseBonus = 1 // 3 letters: +1 second base (reduced from 1)
  }

  // Score-based bonus (same multiplier)
  const scoreBonus = Math.floor(wordScore * SCORE_MULTIPLIER)

  // Total time bonus
  const timeBonus = baseBonus + scoreBonus

  // Cap maximum time bonus at 8 seconds to prevent exploitation (reduced from 15)
  return Math.min(timeBonus, 8)
}

// Get bonus description for UI feedback
export const getTimeBonusDescription = (
  word: string
): { bonus: number; category: string; message: string } => {
  const bonus = calculateTimeBonus(word)
  const score = calculateFinalScore(word)
  const category = getTimeBonusCategory(score)

  const message = `+${bonus}s • ${category} word!`

  return { bonus, category, message }
}
