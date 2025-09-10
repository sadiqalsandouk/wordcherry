export default function Title() {
  return (
    <div className="pt-2 md:pt-12 pb-2 md:pb-8 mb-2 md:mb-6">
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl sm:text-5xl md:text-6xl mr-3">🍒</span>
        <h1
          className={`text-wordcherryYellow text-center text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] leading-tight`}
        >
          WORDCHERRY.COM
        </h1>
      </div>
      <p className="text-white text-center opacity-80 text-sm md:text-lg mt-2">
        Build words. Score points. Have fun!
      </p>
    </div>
  )
}
