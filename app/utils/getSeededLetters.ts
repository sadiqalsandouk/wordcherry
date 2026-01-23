import { createRoundRandom, seededRandomItem, seededShuffle } from "@/lib/seededRandom"
import { WORDS } from "./words"

/**
 * Letter pool with frequency-based distribution
 * Same as getRandomLetters but exported for reuse
 */
export const LETTER_POOL = [
  "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", // 12 E's
  "A", "A", "A", "A", "A", "A", "A", "A", "A", // 9 A's
  "I", "I", "I", "I", "I", "I", "I", "I", "I", // 9 I's
  "O", "O", "O", "O", "O", "O", "O", "O", // 8 O's
  "N", "N", "N", "N", "N", "N", // 6 N's
  "R", "R", "R", "R", "R", "R", // 6 R's
  "T", "T", "T", "T", "T", "T", // 6 T's
  "L", "L", "L", "L", // 4 L's
  "S", "S", "S", "S", // 4 S's
  "U", "U", "U", "U", // 4 U's
  "D", "D", "D", "D", // 4 D's
  "G", "G", "G", // 3 G's
  "B", "B", // 2 B's
  "C", "C", // 2 C's
  "M", "M", // 2 M's
  "P", "P", // 2 P's
  "F", "F", // 2 F's
  "H", "H", // 2 H's
  "V", "V", // 2 V's
  "W", "W", // 2 W's
  "Y", "Y", // 2 Y's
  "K", // 1 K
  "J", // 1 J
  "X", // 1 X
  "Q", // 1 Q
  "Z", // 1 Z
]

/**
 * Cache valid words by length to avoid filtering on every call
 */
let validWordsCache: string[] | null = null

function getValidWords(maxLength: number): string[] {
  if (!validWordsCache) {
    validWordsCache = WORDS.filter((word) => word.length >= 3 && word.length <= 10)
  }
  return validWordsCache.filter((word) => word.length <= maxLength)
}

/**
 * Generate deterministic letters for a specific round
 * All players with the same seed and round index will get the same letters
 * 
 * @param seed - The game seed (32 character string)
 * @param roundIndex - The round number (0-based)
 * @param numberOfTiles - Number of tiles to generate (default: 10)
 * @returns Array of uppercase letters
 */
export function getSeededLetters(
  seed: string,
  roundIndex: number,
  numberOfTiles: number = 10
): string[] {
  // Create a deterministic random function for this round
  const random = createRoundRandom(seed, roundIndex)
  
  // Get valid words that can fit in the tile count
  const validWords = getValidWords(numberOfTiles)
  
  // Pick a random base word
  const baseWord = seededRandomItem(validWords, random)
  
  // Start with the base word letters
  const letters = baseWord.toUpperCase().split("")
  
  // Add random letters to reach the target count
  while (letters.length < numberOfTiles) {
    letters.push(seededRandomItem(LETTER_POOL, random))
  }
  
  // Shuffle the letters so the base word isn't obvious
  return seededShuffle(letters, random)
}

/**
 * Verify that two clients generate the same letters
 * Useful for debugging synchronization issues
 */
export function verifyLetterSync(
  seed: string,
  roundIndex: number,
  expectedLetters: string[]
): boolean {
  const generatedLetters = getSeededLetters(seed, roundIndex)
  return JSON.stringify(generatedLetters) === JSON.stringify(expectedLetters)
}
