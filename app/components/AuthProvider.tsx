"use client"

import { useAnonymousAuth } from "@/lib/supabase/useAnonymousAuth"

export default function AuthProvider() {
  useAnonymousAuth()
  return null
}
