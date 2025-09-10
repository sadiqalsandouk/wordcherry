"use client"

export default function SubmitButton({
  currentWord,
  onSubmitClick,
}: {
  currentWord: string[]
  onSubmitClick: () => void
}) {
  const isDisabled = currentWord.length === 0

  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
      <button
        disabled={isDisabled}
        onClick={onSubmitClick}
        className={`w-full font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 ease-out ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
            : "bg-wordcherryYellow text-wordcherryBlue hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 cursor-pointer"
        }`}
      >
        Submit
      </button>
    </div>
  )
}
