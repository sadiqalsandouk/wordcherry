"use client"
// // In your game page component:
// - Initialize state: tiles (random letters), currentWord (empty)
// - Render tiles as buttons
// - On tile click: move letter to currentWord
// - Render currentWord
// - "Submit" button: on click, clear currentWord and return letters to tiles
import { useEffect, useState } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import TileRack from "./TileRack"


export default function SoloGame() {

    const [tiles, setTiles] = useState<string[]>([])
    const [currentWord, setCurrentWord] = useState<string>('')

    useEffect(() => {
        setTiles(getRandomLetters(7))
    }, [])

    if (tiles.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <TileRack tiles={tiles}/>
    )
}