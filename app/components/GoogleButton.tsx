"use client"

export default function GoogleButton({
  label = "Sign in with Google",
  onClick,
  disabled = false,
}: {
  label?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        // layout
        "inline-flex items-center justify-center gap-3",
        "h-10 px-3",
        // base styles
        "rounded-2xl border border-[#747775] bg-white text-[#1f1f1f]",
        "text-[14px] font-medium tracking-[0.25px]",
        // effects
        "shadow-[2px_2px_0_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]",
        "transition-all duration-150",
        "hover:shadow-[0_1px_2px_rgba(60,64,67,0.30),0_1px_3px_1px_rgba(60,64,67,0.15)]",
        "hover:scale-[1.02] active:scale-95",
        // disabled
        "disabled:opacity-60 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {/* Google G icon (SVG) */}
      <svg viewBox="0 0 48 48" className="block w-5 h-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>

      <span className="truncate">{label}</span>
    </button>
  )
}
