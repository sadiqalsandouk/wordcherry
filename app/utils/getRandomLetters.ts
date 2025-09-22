import getRandomItem from "./getRandomIndex"
import { shuffleArray } from "./shuffleArray"
import { WORDS } from "./words"

export default function getRandomLetters(numberOfTiles: number) {
  // Frequency-based letter distribution (based on actual English letter frequency)
  const letterPool = [
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

  // Get a random word that can fit in the tile count
  const validWords = WORDS.filter((word) => word.length >= 3 && word.length <= numberOfTiles)
  const baseWord = getRandomItem(validWords)
  
  // Start with the base word letters
  let letters = baseWord.split("")
  
  // Add random letters to reach the target count
  while (letters.length < numberOfTiles) {
    letters.push(getRandomItem(letterPool))
  }
  
  // Shuffle the letters so the base word isn't obvious
  return shuffleArray(letters)
}
