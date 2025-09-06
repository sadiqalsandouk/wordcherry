import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"
import Title from "./components/Title"

export default function Home() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <Title />
      <div className="mt-8 space-y-8">
        <SoloButton />
        <div className="text-center text-white text-lg font-bold my-4 opacity-70">- OR -</div>
        <JoinForm />
      </div>
    </div>
  )
}
