import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"
import Title from "./components/Title"

export default function Home() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <Title />
      <div className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6 md:space-y-8">
        <SoloButton />
        <div className="text-center text-white text-base sm:text-lg font-bold my-2 sm:my-4 opacity-70">- OR -</div>
        <JoinForm />
      </div>
    </div>
  )
}
