import { useEffect } from "react"
import { supabase } from "./supabase"

export function useAnonymousAuth() {
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
      }
    }
    init()
  }, [])
}
