interface TileProps {
    letter: string;
  }

export default function Tile({letter}: TileProps) {
  return <div className="border-2 border-solid">{letter}</div>
}