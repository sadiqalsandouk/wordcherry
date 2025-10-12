import { supabase } from "@/lib/supabase/supabase"
import { useEffect, useState } from "react"

export function usePlayerName() {
  const [playerName, setPlayerName] = useState("Guest-??????")

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const guestName = `Guest-${user.id.slice(0, 6)}`
        setPlayerName(guestName)
      } else {
        setPlayerName("Guest-??????")
      }
    }
    fetchUsername()
  }, [])
  return playerName
}
