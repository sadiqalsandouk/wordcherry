"use client"
import Link from "next/link"

export default function SoloButton() {
  return (
    <div className="mx-auto max-w-sm px-4 mt-4">
      <Link href="/solo" className="block">
        <button className="cursor-pointer w-full bg-applegramYellow text-applegramBlue font-bold text-3xl py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-applegramYellow/90">
          PLAY SOLO
        </button>
      </Link>
    </div>
  )
}