"use client"

import { createContext, useContext } from "react"
import { useAuth } from "@/lib/supabase/useAuth"

type Ctx = {
  playerName: string
  isLoading: boolean
  isAuthenticated: boolean
  setPlayerName: (name: string) => void
}

const PlayerNameContext = createContext<Ctx>({
  playerName: "Guest-??????",
  isLoading: true,
  isAuthenticated: false,
  setPlayerName: () => {},
})

export const usePlayerName = () => useContext(PlayerNameContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { playerName, isLoading, isAuthenticated, setPlayerName } = useAuth()

  return (
    <PlayerNameContext.Provider value={{ playerName, isLoading, isAuthenticated, setPlayerName }}>
      {children}
    </PlayerNameContext.Provider>
  )
}
