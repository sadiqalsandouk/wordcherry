interface PreStartScreenProps {
  handleStartGame: () => void
}

export default function PreStartScreen({ handleStartGame }: PreStartScreenProps) {
  return (
    <div className="">
        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl mb-4 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="space-y-2 text-gray-700 text-center">
              <div className="text-base sm:text-lg font-semibold">
                How to play:
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                The tile rack has 10 random letters use them to build words!
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                The more complex the word the more points and time you earn
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                Either tap or type letters to form words and submit them
              </div>       
            </div>
            <figure className="w-full relative overflow-hidden rounded-2xl border border-gray-200 shadow-md aspect-video">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/demo-prestart-poster.jpg"
                aria-label="Looping preview showing letters being tapped, submitted, and rewarding bonus time"
              >
                <source src="/demo-prestart.mp4" type="video/mp4" />
                <source src="/demo-prestart.webm" type="video/webm" />
                Your browser does not support inline preview video.
              </video>
            </figure>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="cursor-pointer w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 active:scale-95 transition-all duration-200"
        >
          START GAME
        </button>
      </div>
  )
}
