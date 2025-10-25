import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import { getDeviceGuest, saveDeviceGuest } from "@/lib/deviceGuest"

export function useAuth() {
  const [playerName, setPlayerName] = useState("Guest-??????")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        const saved = getDeviceGuest()
        if (saved?.refresh_token) {
          await supabase.auth
            .setSession({
              access_token: saved.access_token,
              refresh_token: saved.refresh_token,
            })
            .catch(() => {})
        }
      }

      let {
        data: { session: sess },
      } = await supabase.auth.getSession()
      if (!sess) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (!error && data.session) {
          saveDeviceGuest({
            user_id: data.user!.id,
            refresh_token: data.session.refresh_token!,
            access_token: data.session.access_token!,
          })
          sess = data.session
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const authed =
          !(user as any).is_anonymous &&
          !(user.identities ?? []).every((i: any) => i?.provider === "anonymous")

        if (authed) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle()

          const name =
            profile?.username ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email ||
            "Player"

          setPlayerName(name)
          setIsAuthenticated(true)
        } else {
          setPlayerName(`Guest-${user.id.slice(0, 6)}`)
          setIsAuthenticated(false)
        }
      }

      setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session?.user) {
        const u = session.user as any
        const isAnon =
          u?.is_anonymous ??
          ((u.identities ?? []).length > 0 &&
            (u.identities ?? []).every((i: any) => i?.provider === "anonymous"))

        if (isAnon) {
          // Save this anon as the device guest if not saved yet
          const saved = getDeviceGuest()
          if (!saved && session.refresh_token && session.access_token) {
            saveDeviceGuest({
              user_id: u.id,
              refresh_token: session.refresh_token,
              access_token: session.access_token,
            })
          }
          setPlayerName(`Guest-${u.id.slice(0, 6)}`)
          setIsAuthenticated(false)
        } else {
          // Authenticated: recompute name (profiles.username first)
          supabase
            .from("profiles")
            .select("username")
            .eq("id", u.id)
            .maybeSingle()
            .then(({ data: profile }) => {
              const name =
                profile?.username ||
                u.user_metadata?.full_name ||
                u.user_metadata?.name ||
                u.email ||
                "Player"
              setPlayerName(name)
              setIsAuthenticated(true)
            })
        }
      } else {
        setPlayerName("Guest-??????")
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const switchToGuest = async () => {
    const saved = getDeviceGuest()
    if (saved?.refresh_token) {
      await supabase.auth.setSession({
        access_token: saved.access_token,
        refresh_token: saved.refresh_token,
      })
    } else {
      const { data } = await supabase.auth.signInAnonymously()
      if (data?.session) {
        saveDeviceGuest({
          user_id: data.user!.id,
          refresh_token: data.session.refresh_token!,
          access_token: data.session.access_token!,
        })
      }
    }
  }

  return { playerName, isLoading, isAuthenticated, setPlayerName, switchToGuest }
}
