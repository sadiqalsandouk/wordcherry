"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const qp = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("wc:justSignedIn", "1")
    }
    const next = qp.get("next") || "/account"
    const t = setTimeout(() => router.replace(next), 800)
    return () => clearTimeout(t)
  }, [qp, router])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
      <div className="text-lg font-semibold text-white animate-pulse">Signing in</div>

      <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-full bg-wordcherryYellow animate-[loading_1s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
