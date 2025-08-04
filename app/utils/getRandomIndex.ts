export default function getRandomIndex(arr: Array<string>) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return randomIndex
}