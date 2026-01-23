/**
 * Seeded PRNG using the Mulberry32 algorithm
 * Produces deterministic random numbers given a seed
 */

/**
 * Convert a string seed to a numeric seed
 */
export function seedToNumber(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Create a seeded random number generator using Mulberry32
 * Returns a function that generates random numbers between 0 and 1
 */
export function createSeededRandom(seed: string | number): () => number {
  let numericSeed = typeof seed === "string" ? seedToNumber(seed) : seed
  
  return function() {
    let t = numericSeed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/**
 * Create a random generator with a specific seed and round index
 * This ensures each round has different but deterministic letters
 */
export function createRoundRandom(seed: string, roundIndex: number): () => number {
  // Combine seed and round index to create unique seed per round
  const combinedSeed = `${seed}-round-${roundIndex}`
  return createSeededRandom(combinedSeed)
}

/**
 * Pick a random item from an array using a seeded random function
 */
export function seededRandomItem<T>(arr: T[], random: () => number): T {
  const index = Math.floor(random() * arr.length)
  return arr[index]
}

/**
 * Shuffle an array using a seeded random function (Fisher-Yates)
 */
export function seededShuffle<T>(arr: T[], random: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
