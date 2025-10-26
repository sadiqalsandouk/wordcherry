import { supabase } from "@/lib/supabase/supabase"

export async function getMyProfile() {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .single()

  if (error) throw error
  return data as { id: string; username: string | null }
}

export async function setMyUsername(username: string) {
  const clean = username.trim().toLowerCase()
  if (!/^[a-z0-9_]{3,24}$/.test(clean)) {
    throw new Error("Usernames must be 3–24 characters (a–z, 0–9, _).")
  }

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error("Not signed in")

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, username: clean }, { onConflict: "id" })

  if (error) {
    if (error.code === "23505" || /unique/i.test(error.message)) {
      throw new Error("That username is already taken.")
    }
    throw error
  }

  const { data: confirm, error: selErr } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()
  if (selErr) throw selErr

  return confirm?.username || clean
}
