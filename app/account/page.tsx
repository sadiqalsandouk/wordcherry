"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { usePlayerName } from "@/app/components/AuthProvider"
import { getMyProfile, setMyUsername } from "@/lib/profiles"
import { continueWithGoogle } from "@/lib/supabase/oauth"
import { getDeviceGuest, saveDeviceGuest } from "@/lib/deviceGuest"
import { getOrCreateDeviceToken } from "@/lib/deviceToken"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import GoogleButton from "../components/GoogleButton"

type Identity = { provider: string }
type Entry = {
  id: string
  game_id: string
  user_id: string
  player_name: string
  score: number
  best_word: string | null
  best_word_score: number | null
  created_at: string
  is_anonymous: boolean | null
}

export default function AccountPage() {
  const { playerName, isAuthenticated, setPlayerName } = usePlayerName()
  const router = useRouter()
  const qp = useSearchParams()

  const [userId, setUserId] = useState("")
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [identities, setIdentities] = useState<Identity[]>([])
  const [loading, setLoading] = useState(true)

  const [currentUsername, setCurrentUsername] = useState("")
  const [username, setUsername] = useState("")
  const [savingUsername, setSavingUsername] = useState(false)

  const PAGE_SIZE = 10
  const [games, setGames] = useState<Entry[]>([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [gamesError, setGamesError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  useEffect(() => {
    if (!loading && qp.get("deleted") === "1") {
      toast("Account deleted")
      router.replace("/account")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, qp, router])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!mounted) return

      if (user) {
        const isAnon =
          (user as any)?.is_anonymous ||
          (Array.isArray(user.identities) &&
            user.identities.length > 0 &&
            user.identities.every((i: any) => i?.provider === "anonymous"))

        if (!isAnon) {
          setUserId(user.id)
          setEmail(user.email ?? "")
          setCreatedAt(
            new Date(user.created_at || user.last_sign_in_at || Date.now()).toLocaleString()
          )
          setIdentities((user.identities ?? []) as Identity[])

          const profile = await getMyProfile().catch(() => null)
          setCurrentUsername(profile?.username ?? "")

          await loadGames(user.id, true)
        } else {
          setIdentities((user.identities ?? []) as Identity[])
        }
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  async function onSaveUsername() {
    if (!isAuthenticated) return
    setSavingUsername(true)
    try {
      const clean = await setMyUsername(username)
      setPlayerName(clean)
      setCurrentUsername(clean)
      setUsername("")
      toast("Username updated")
    } catch (e: any) {
      toast.error(e?.message || "Could not save username")
    } finally {
      setSavingUsername(false)
    }
  }

  async function onClaimDeviceScores() {
    try {
      if (!isAuthenticated) {
        toast("Sign in first to claim scores")
        return
      }
      const token = getOrCreateDeviceToken()
      const { data, error } = await supabase.rpc("claim_device_scores", { device_token: token })
      if (error) throw error
      const n = Number(data ?? 0)
      toast(
        n > 0
          ? `Claimed ${n} score${n === 1 ? "" : "s"} from this device`
          : "No guest scores to claim on this device"
      )
      if (n > 0 && userId) await loadGames(userId, true)
    } catch (e: any) {
      toast.error(e?.message || "Could not claim scores")
    }
  }

  async function onSignOut() {
    try {
      await supabase.auth.signOut()
    } catch {}
    const saved = getDeviceGuest()
    if (saved?.refresh_token && saved?.access_token) {
      await supabase.auth
        .setSession({ refresh_token: saved.refresh_token, access_token: saved.access_token })
        .catch(() => {})
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
    toast("Signed out")
    window.location.assign("/account")
  }

  async function performDelete() {
    try {
      setConfirmText("")
      setShowDeleteModal(false)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error("Not signed in")
        return
      }

      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      let payload: any = null
      const ct = res.headers.get("content-type") || ""
      if (ct.includes("application/json")) {
        payload = await res.json().catch(() => null)
      } else {
        const text = await res.text().catch(() => "")
        payload = { error: text || "Unknown server error" }
      }

      if (!res.ok) {
        throw new Error(payload?.error || "Could not delete account")
      }

      try {
        await supabase.auth.signOut()
      } catch {}

      sessionStorage.setItem("wc:justDeleted", "1")
      router.replace("/account?deleted=1")
    } catch (e: any) {
      toast.error(e?.message || "Could not delete account")
    }
  }

  async function loadGames(uid: string, reset = false) {
    setGamesLoading(true)
    setGamesError(null)
    try {
      const from = reset ? 0 : games.length
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from("leaderboard_entries")
        .select(
          "id, game_id, user_id, player_name, score, best_word, best_word_score, created_at, is_anonymous",
          { count: "exact" }
        )
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      setGames(reset ? (data as Entry[]) : [...games, ...(data as Entry[])])
      if (typeof count === "number") {
        setHasMore(to + 1 < count)
      } else {
        setHasMore((data?.length || 0) === PAGE_SIZE)
      }
    } catch (e: any) {
      setGamesError(e?.message || "Could not load games")
    } finally {
      setGamesLoading(false)
    }
  }

  const stats = useMemo(() => {
    if (!games.length) {
      return {
        total: 0,
        bestScore: 0,
        bestWord: "",
        bestWordScore: 0,
        avg: 0,
        lastPlayed: "",
        allTimeScore: 0,
      }
    }
    const total = games.length
    let bestScore = 0
    let bestWord = ""
    let bestWordScore = 0
    let sum = 0
    let lastPlayed = games[0]?.created_at || ""
    let allTimeScore = 0

    for (const g of games) {
      sum += g.score
      allTimeScore += g.score
      if (g.score > bestScore) bestScore = g.score
      if ((g.best_word_score || 0) > bestWordScore) {
        bestWordScore = g.best_word_score || 0
        bestWord = (g.best_word || "").toUpperCase()
      }
    }
    const avg = Math.round(sum / total)
    return { total, bestScore, bestWord, bestWordScore, avg, lastPlayed, allTimeScore }
  }, [games])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-5xl">🍒</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] mb-6">
          <div className="bg-wordcherryYellow py-3 px-4 text-center">
            <h2 className="text-2xl font-bold text-wordcherryBlue">Profile</h2>
          </div>

          <div className="bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              {!isAuthenticated && (
                <span className="text-amber-800 bg-amber-100 border border-amber-200 text-xs px-2 py-0.5 rounded-full">
                  Guest
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">🍒</div>
              <div>
                <div className="font-bold text-xl text-gray-900 leading-tight">{playerName}</div>
                {isAuthenticated ? (
                  <div className="text-xs text-gray-500">Your profile name</div>
                ) : (
                  <div className="text-xs text-gray-500">Scores stay on this device only</div>
                )}
              </div>
            </div>

            {/* Username editor */}
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-1">
              Username
            </label>

            <div className="flex gap-2">
              <div className="relative group flex-1">
                {!isAuthenticated && (
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                )}
                <input
                  id="username"
                  className={[
                    "w-full border-2 rounded py-2 bg-white focus:outline-none focus:ring-2 focus:ring-wordcherryYellow/60 transition-all",
                    isAuthenticated
                      ? "border-wordcherryBlue/30 text-gray-900 px-3"
                      : "border-gray-300 text-gray-400 bg-gray-50 pl-9 pr-3",
                  ].join(" ")}
                  placeholder={isAuthenticated ? "Choose a username" : "Sign in to set a username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isAuthenticated}
                  aria-disabled={!isAuthenticated}
                />
              </div>

              <button
                onClick={onSaveUsername}
                disabled={
                  !isAuthenticated ||
                  savingUsername ||
                  !username.trim() ||
                  username.trim().toLowerCase() === currentUsername.trim().toLowerCase()
                }
                className="cursor-pointer bg-wordcherryYellow text-wordcherryBlue font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>

            {isAuthenticated && (
              <p className="mt-2 text-xs text-gray-500">
                Appears on the leaderboard. Use 3-24 characters: a-z, 0-9, underscore.
              </p>
            )}

            {!isAuthenticated && (
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-600 mb-2">
                  Create an account to sync your scores, view your stats and set a username.
                </p>
                <GoogleButton onClick={() => continueWithGoogle()}></GoogleButton>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <>
            <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] mb-6">
              <div className="bg-wordcherryYellow py-3 px-4 text-center">
                <h2 className="text-2xl font-bold text-wordcherryBlue">My Stats</h2>
              </div>
              <div className="bg-white p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Stat label="Total games" value={stats.total.toLocaleString()} />
                <Stat label="Best score" value={stats.bestScore.toLocaleString()} />
                <Stat
                  label="Best word"
                  value={stats.bestWord ? `${stats.bestWord} (+${stats.bestWordScore})` : "—"}
                />
                <Stat label="Average score" value={stats.avg.toLocaleString()} />
                <Stat
                  label="Last played"
                  value={stats.lastPlayed ? formatDate(stats.lastPlayed) : "—"}
                />
                <Stat label="Lifetime points" value={stats.allTimeScore.toLocaleString()} />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] mb-6">
              <div className="bg-wordcherryYellow py-3 px-4 text-center">
                <h2 className="text-2xl font-bold text-wordcherryBlue">Recent Games</h2>
              </div>
              <div className="bg-white">
                {gamesLoading && games.length === 0 && (
                  <div className="p-6 text-center text-gray-600">Loading your games</div>
                )}
                {gamesError && (
                  <div className="p-6 text-center text-red-700">Could not load games</div>
                )}
                {!gamesLoading && !gamesError && games.length === 0 && (
                  <div className="p-6 text-center text-gray-600">
                    No games yet — go set a high score!
                  </div>
                )}

                {games.length > 0 && (
                  <div className="divide-y divide-gray-200">
                    {games.map((g) => (
                      <div key={g.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900">
                            {formatDate(g.created_at)}
                          </div>
                          <div className="text-2xl font-bold text-wordcherryBlue">
                            {g.score.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            {g.best_word && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Best word</div>
                                <div className="font-mono text-lg font-bold text-gray-800 uppercase tracking-wider">
                                  {g.best_word}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {g.best_word_score && g.best_word_score > 0 && (
                              <div className="text-lg font-semibold text-green-600">
                                +{g.best_word_score.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="p-4 text-center">
                    <button
                      onClick={() => loadGames(userId)}
                      className="cursor-pointer bg-wordcherryYellow text-wordcherryBlue font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={gamesLoading}
                    >
                      {gamesLoading ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] mb-6">
              <div className="bg-wordcherryYellow py-3 px-4 text-center">
                <h2 className="text-2xl font-bold text-wordcherryBlue">Sync Scores</h2>
              </div>
              <div className="bg-white p-5 space-y-3">
                <p className="text-sm text-gray-600">
                  If you played in guest mode on this device, you can add those scores to your
                  account!
                </p>
                <button
                  onClick={onClaimDeviceScores}
                  className="cursor-pointer bg-wordcherryYellow text-wordcherryBlue font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200"
                >
                  Sync Scores From This Device
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
              <div className="bg-wordcherryYellow py-3 px-4 text-center">
                <h2 className="text-2xl font-bold text-wordcherryBlue">Account</h2>
              </div>
              <div className="bg-white p-5">
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  {email && (
                    <div>
                      <span className="font-medium">Email:</span> {email}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created:</span> {createdAt}
                  </div>
                </div>

                <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">Sign out</div>
                    <div className="text-sm text-gray-600">
                      You’ll return to guest mode on this device.
                    </div>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="cursor-pointer w-full sm:w-auto bg-wordcherryBlue text-wordcherryYellow font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryBlue/90 hover:scale-103 active:scale-95 transition-all duration-200"
                  >
                    Sign out
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 grid gap-3 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium text-red-700">Delete account</div>
                    <div className="text-sm text-gray-600">
                      Permanently removes your account and data. This action can't be undone.
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="cursor-pointer w-full sm:w-auto bg-white text-red-700 font-bold px-4 py-2 rounded-xl border border-red-300 hover:bg-red-50 shadow-[2px_2px_0_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.05)] hover:scale-103 active:scale-95 transition-all duration-200"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="bg-wordcherryYellow text-wordcherryBlue text-center font-bold text-lg py-3 rounded-t-2xl">
              Delete Account
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-700">
                This will permanently remove your account and scores. This action cannot be undone.
              </p>

              <div>
                <label htmlFor="confirm" className="block text-xs font-semibold text-gray-700 mb-1">
                  Type <span className="font-mono">DELETE</span> to confirm
                </label>
                <input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full border-2 border-wordcherryBlue/30 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-wordcherryYellow/60"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setConfirmText("")
                    setShowDeleteModal(false)
                  }}
                  className="cursor-pointer flex-1 bg-white text-gray-800 font-bold px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 shadow-[2px_2px_0_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.05)] hover:scale-103 active:scale-95 transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  onClick={performDelete}
                  disabled={confirmText !== "DELETE"}
                  className="cursor-pointer flex-1 bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-red-700 hover:scale-103 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#fff7d6] rounded-lg p-3 border border-wordcherryBlue/30 text-center">
      <div className="text-gray-600 text-xs mb-1">{label}</div>
      <div className="text-wordcherryBlue font-bold text-lg">{value}</div>
    </div>
  )
}
