// app/components/AuthProvider.tsx
"use client"

import { createContext, useContext } from "react"
import { useAnonymousAuth } from "@/lib/supabase/useAnonymousAuth"

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
  const { playerName, isLoading } = useAnonymousAuth()

  return (
    <PlayerNameContext.Provider
      value={{
        playerName,
        isLoading,
        isAuthenticated: false, // Always false since we only have anonymous users for now
      }}
    >
      {children}
    </PlayerNameContext.Provider>
  )
}
