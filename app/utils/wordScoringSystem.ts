export const letterToPoints: { [letter: string]: number } = {
  E: 1,
  A: 1,
  I: 1,
  O: 1,
  N: 1,
  R: 1,
  T: 1,
  L: 1,
  S: 1,
  U: 1,
  D: 2,
  G: 2,
  B: 2,
  C: 2,
  M: 2,
  P: 2,
  F: 2,
  H: 2,
  V: 2,
  J: 2,
  W: 3,
  Y: 3,
  K: 5,
  X: 9,
  Q: 9,
  Z: 10,
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

export const calculateFinalScore = (word: string) => {
  return calculateBaseScore(word) * getMultiplier(word.length)
}
