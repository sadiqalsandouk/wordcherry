"use client"
import { supabase } from "./supabase"

export async function continueWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`
  const { data: sess } = await supabase.auth.getSession()

  if (sess?.session) {
    return supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo },
    })
  }

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  })
}
