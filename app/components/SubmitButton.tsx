"use client"

export default function SubmitButton({
  currentWord,
  onSubmitClick,
}: {
  currentWord: string[]
  onSubmitClick: () => void
}) {
  return (
    <div className="mx-auto max-w-sm px-2 mt-2">
      <button
        disabled={currentWord.length === 0}
        onClick={onSubmitClick}
        className="cursor-pointer w-full bg-applegramYellow text-applegramBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-applegramYellow/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-applegramYellow"
      >
        Submit
      </button>
    </div>
  )
}
