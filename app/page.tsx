import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"
import Title from "./components/Title"

export default function Home() {
  return (
    <div className="min-h-screen bg-applegramBlue relative overflow-hidden px-4">
      <div className="relative z-10">
        <Title />
        <SoloButton />
        <div className="text-center text-white text-lg font-bold my-2 opacity-70">
          - OR -
        </div>
        <JoinForm />
      </div>
    </div>
  )
}
