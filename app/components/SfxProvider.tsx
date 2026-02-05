"use client"

import { useEffect } from "react"
import { sfx } from "@/app/utils/sfx"

type SfxProviderProps = {
  children: React.ReactNode
}

export default function SfxProvider({ children }: SfxProviderProps) {
  useEffect(() => {
    const unlock = () => {
      void sfx.unlock()
    }

    window.addEventListener("pointerdown", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })

    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
  }, [])

  return <>{children}</>
}
