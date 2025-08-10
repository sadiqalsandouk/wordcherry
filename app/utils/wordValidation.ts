/**
 * Word validation service using the free Dictionary API
 * https://dictionaryapi.dev/
 */

export async function validateWord(word: string): Promise<boolean> {
  const cleanWord = word.trim().toLowerCase()

  if (cleanWord.length < 2) {
    return false
  }

  if (!/^[a-z]+$/.test(cleanWord)) {
    return false
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)

    if (response.ok) {
      return true
    }

    if (response.status === 404) {
      return false
    }

    return false
  } catch (error) {
    console.error("Word validation error:", error)
    return false
  }
}
