export default function getRandomItem(arr: Array<string>): string {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}
