import { Crown, PartyPopper, Star, ThumbsUp, Sprout, Dumbbell, LucideIcon } from "lucide-react"
import { PerformanceLevel } from "@/app/types/types"

export const getPerformanceLevel = (score: number): PerformanceLevel => {
  let icon: LucideIcon
  let title = ""
  let subtitle = ""
  let bgColor = "bg-gray-100"
  let textColor = "text-gray-800"
  let showConfetti = false
  let buttonColor = "bg-wordcherryYellow"
  let buttonTextColor = "text-wordcherryBlue"

  if (score >= 600) {
    icon = Crown
    title = "LEGENDARY!"
    subtitle = "You're a word wizard! Seriously impressive!"
    showConfetti = true
  } else if (score >= 400) {
    icon = PartyPopper
    title = "AMAZING!!"
    subtitle = "Outstanding performance! You're a word master!"
    showConfetti = true
  } else if (score >= 250) {
    icon = Star
    title = "Great Job!"
    subtitle = "Excellent work! You're getting really good at this!"
  } else if (score >= 100) {
    icon = ThumbsUp
    title = "Good Work!"
    subtitle = "Keep up the effort!"
  } else if (score >= 50) {
    icon = Sprout
    title = "Keep Going!"
    subtitle = "Practice makes perfect!"
  } else {
    icon = Dumbbell
    title = "Don't Give Up!"
    subtitle = "You can do better. Try again!"
  }

  return {
    icon,
    title,
    subtitle,
    bgColor,
    textColor,
    showConfetti,
    buttonColor,
    buttonTextColor,
  }
}
