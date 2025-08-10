import Tile from "./Tile"

interface TileRackProps {
  tiles: string[]
  onTileClick: (letter: string, index: number) => void
}

export default function TileRack({ tiles, onTileClick }: TileRackProps) {
  return (
    <div className="text-2xl font-black flex flex-row gap-x-2">
      {tiles.map((letter, index) => (
        <Tile key={index} letter={letter} onClick={() => onTileClick(letter, index)} />
      ))}
    </div>
  )
}
