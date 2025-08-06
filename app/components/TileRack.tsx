import Tile from "./Tile";

interface TileRackProps {
    tiles: string[]
}

export default function TileRack({tiles}: TileRackProps) {
  return (
    <div className="text-2xl font-black flex flex-row gap-x-2">
      {tiles.map((letter, index) => (
        <Tile key={index} letter={letter} />
      ))}
    </div>
  );
}
