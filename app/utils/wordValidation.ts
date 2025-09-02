import { WORDS } from "./words"

export function validateWord(word: string) {
  return WORDS.includes(word)
}
