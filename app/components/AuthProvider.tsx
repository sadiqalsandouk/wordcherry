"use client"

import { createContext, useContext } from "react"
import { useAuth } from "@/lib/supabase/useAuth"

const PlayerNameContext = createContext<{
  playerName: string
  isLoading: boolean
  isAuthenticated: boolean
}>({
  playerName: "Guest-??????",
  isLoading: true,
  isAuthenticated: false,
})

export const usePlayerName = () => useContext(PlayerNameContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { playerName, isLoading, isAuthenticated } = useAuth()

  return (
    <PlayerNameContext.Provider value={{ playerName, isLoading, isAuthenticated }}>
      {children}
    </PlayerNameContext.Provider>
  )
}
