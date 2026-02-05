import { WORDS } from "./words"

export function validateWord(word: string) {
  if (!/^[A-Z]{3,10}$/.test(word)) return false
  return WORDS.includes(word)
}
