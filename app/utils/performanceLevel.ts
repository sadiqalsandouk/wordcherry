import { PerformanceLevel } from "@/app/types/types"

export const getPerformanceLevel = (score: number): PerformanceLevel => {
  if (score >= 600) {
    return {
      emoji: "🏆",
      title: "LEGENDARY!",
      subtitle: "You're a word wizard! Seriously impressive!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: true,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  } else if (score >= 400) {
    return {
      emoji: "🎉",
      title: "AMAZING!!",
      subtitle: "Outstanding performance! You're a word master!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: true,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  } else if (score >= 250) {
    return {
      emoji: "⭐",
      title: "Great Job!",
      subtitle: "Excellent work! You're getting really good at this!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: false,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  } else if (score >= 100) {
    return {
      emoji: "👍",
      title: "Good Work!",
      subtitle: "Keep up the effort!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: false,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  } else if (score >= 50) {
    return {
      emoji: "🌱",
      title: "Keep Going!",
      subtitle: "Practice makes perfect!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: false,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  } else {
    return {
      emoji: "💪",
      title: "Don't Give Up!",
      subtitle: "You can do better. Try again!",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      showConfetti: false,
      buttonColor: "bg-wordcherryYellow",
      buttonTextColor: "text-wordcherryBlue",
    }
  }
}
