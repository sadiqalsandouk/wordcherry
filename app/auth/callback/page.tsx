"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const qp = useSearchParams()

  useEffect(() => {
    const next = qp.get("next") || "/"
    const t = setTimeout(() => router.replace(next), 200)
    return () => clearTimeout(t)
  }, [qp, router])

  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="animate-pulse">Finishing sign-in…</div>
    </div>
  )
}
