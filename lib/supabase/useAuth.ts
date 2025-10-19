import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export function useAuth() {
  const [playerName, setPlayerName] = useState("Guest-??????")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const provider = user.app_metadata?.provider
        if (provider && provider !== "anon") {
          const display =
            user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Player"
          setPlayerName(display)
          setIsAuthenticated(true)
        } else {
          const guestName = `Guest-${user.id.slice(0, 6)}`
          setPlayerName(guestName)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const provider = session.user.app_metadata?.provider
        const name =
          provider && provider !== "anon"
            ? session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email ||
              "Player"
            : `Guest-${session.user.id.slice(0, 6)}`
        setPlayerName(name)
        setIsAuthenticated(!!provider && provider !== "anon")
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { playerName, isLoading, isAuthenticated }
}
