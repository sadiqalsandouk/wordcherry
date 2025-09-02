import JoinForm from "./components/JoinForm"
import SoloButton from "./components/SoloButton"
import Title from "./components/Title"

export default function Home() {
  return (
    <div>
      <Title />
      <SoloButton />
      <div className="text-center text-white text-lg font-bold my-2 opacity-70">- OR -</div>
      <JoinForm />
    </div>
  )
}
