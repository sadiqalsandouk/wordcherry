import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export function useAnonymousAuth() {
  const [playerName, setPlayerName] = useState("Guest-??????")
  const [isLoading, setIsLoading] = useState(true)

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
        const guestName = `Guest-${user.id.slice(0, 6)}`
        setPlayerName(guestName)
      }
      setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const guestName = `Guest-${session.user.id.slice(0, 6)}`
        setPlayerName(guestName)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { playerName, isLoading }
}
