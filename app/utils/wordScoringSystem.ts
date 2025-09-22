// Letter frequency-based scoring (rarer letters = more points)
export const letterToPoints: { [letter: string]: number } = {
  // Most common letters (lowest points)
  E: 1,  // 182,737 occurrences
  S: 1,  // 150,214 occurrences  
  I: 1,  // 140,307 occurrences
  A: 1,  // 120,947 occurrences
  R: 1,  // 112,463 occurrences
  N: 1,  // 106,767 occurrences
  T: 1,  // 104,041 occurrences
  O: 1,  // 103,496 occurrences
  L: 2,  // 84,619 occurrences
  C: 2,  // 64,168 occurrences
  D: 2,  // 54,871 occurrences
  U: 2,  // 52,109 occurrences
  P: 2,  // 46,599 occurrences
  M: 2,  // 44,853 occurrences
  G: 2,  // 43,531 occurrences
  H: 3,  // 36,764 occurrences
  B: 3,  // 30,123 occurrences
  Y: 3,  // 25,868 occurrences
  F: 4,  // 20,029 occurrences
  V: 4,  // 15,429 occurrences
  K: 4,  // 14,447 occurrences
  W: 5,  // 12,417 occurrences
  Z: 6,  // 7,597 occurrences
  X: 7,  // 4,761 occurrences
  J: 8,  // 2,674 occurrences
  Q: 8,  // 2,584 occurrences
}

// Common prefixes that should be penalized
const commonPrefixes: { [prefix: string]: number } = {
  "PRE": 0.7,  // 1,876 words
  "CON": 0.7,  // 1,873 words
  "DIS": 0.7,  // 1,650 words
  "OVE": 0.7,  // 1,649 words
  "NON": 0.7,  // 1,473 words
  "PRO": 0.7,  // 1,448 words
  "OUT": 0.7,  // 1,437 words
  "INT": 0.7,  // 1,260 words
  "MIS": 0.7,  // 1,245 words
  "SUB": 0.7,  // 1,074 words
  "ANT": 0.8,  // 909 words
  "COM": 0.8,  // 893 words
  "RES": 0.8,  // 882 words
  "TRA": 0.8,  // 857 words
  "REC": 0.8,  // 843 words
  "PER": 0.8,  // 801 words
  "PAR": 0.8,  // 782 words
  "CAR": 0.8,  // 754 words
  "SUP": 0.8,  // 754 words
  "FOR": 0.8,  // 719 words
}

// Common suffixes that should be penalized
const commonSuffixes: { [suffix: string]: number } = {
  "ING": 0.6,  // 13,006 words
  "ERS": 0.7,  // 6,149 words
  "SES": 0.7,  // 4,839 words
  "IES": 0.7,  // 4,694 words
  "ESS": 0.7,  // 3,731 words
  "ONS": 0.7,  // 3,311 words
  "TED": 0.7,  // 3,006 words
  "ION": 0.7,  // 2,818 words
  "TES": 0.7,  // 2,424 words
  "BLE": 0.8,  // 1,931 words
  "EST": 0.8,  // 1,884 words
  "LLY": 0.8,  // 1,713 words
  "ATE": 0.8,  // 1,705 words
  "STS": 0.8,  // 1,503 words
  "LES": 0.8,  // 1,482 words
  "LED": 0.8,  // 1,463 words
  "ITY": 0.8,  // 1,452 words
  "TIC": 0.8,  // 1,441 words
  "IER": 0.8,  // 1,434 words
  "NTS": 0.8,  // 1,393 words
}

export const getMultiplier = (wordLength: number) => {
  if (wordLength >= 9) {
    return 2.5
  } else if (wordLength >= 7) {
    return 2
  } else if (wordLength >= 4) {
    return 1.5
  } else return 1
}

export const calculateBaseScore = (word: string) => {
  const splitWord = word.split("")
  const initialValue = 0
  const sum = splitWord.reduce(
    (accumulator, currentValue) => accumulator + letterToPoints[currentValue],
    initialValue
  )
  return sum
}

export const calculateRarityMultiplier = (word: string) => {
  let multiplier = 1.0
  
  // Check for common prefixes
  for (const [prefix, penalty] of Object.entries(commonPrefixes)) {
    if (word.startsWith(prefix)) {
      multiplier *= penalty
      break // Only apply the first matching prefix
    }
  }
  
  // Check for common suffixes
  for (const [suffix, penalty] of Object.entries(commonSuffixes)) {
    if (word.endsWith(suffix)) {
      multiplier *= penalty
      break // Only apply the first matching suffix
    }
  }
  
  return multiplier
}

export const calculateFinalScore = (word: string) => {
  const baseScore = calculateBaseScore(word)
  const lengthMultiplier = getMultiplier(word.length)
  const rarityMultiplier = calculateRarityMultiplier(word)
  
  return Math.round(baseScore * lengthMultiplier * rarityMultiplier)
}

