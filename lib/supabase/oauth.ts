"use client"
import { supabase } from "./supabase"

export async function continueWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  })
}

export async function linkGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`
  return supabase.auth.linkIdentity({
    provider: "google",
    options: { redirectTo },
  })
}
