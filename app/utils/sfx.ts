type Tone = {
  freq: number
  duration: number
  type?: OscillatorType
  volume?: number
  time?: number
}

let audioContext: AudioContext | null = null
let unlocked = false
let muted = false

const getContext = () => {
  if (typeof window === "undefined") return null
  if (!audioContext) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new Ctx()
  }
  return audioContext
}

const resumeContext = async () => {
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === "suspended") {
    await ctx.resume()
  }
}

const playTone = (tone: Tone) => {
  const ctx = getContext()
  if (!ctx || muted) return
  const startAt = ctx.currentTime + (tone.time ?? 0)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = tone.type ?? "sine"
  osc.frequency.setValueAtTime(tone.freq, startAt)
  gain.gain.setValueAtTime(tone.volume ?? 0.08, startAt)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startAt)
  osc.stop(startAt + tone.duration)
}

const playSequence = (tones: Tone[], gap = 0.03) => {
  let offset = 0
  tones.forEach((tone) => {
    playTone({ ...tone, time: (tone.time ?? 0) + offset })
    offset += tone.duration + gap
  })
}

export const sfx = {
  unlock: async () => {
    if (unlocked) return
    await resumeContext()
    unlocked = true
  },
  setMuted: (value: boolean) => {
    muted = value
  },
  isMuted: () => muted,
  join: () =>
    playSequence(
      [
        { freq: 880, duration: 0.05, type: "square", volume: 0.06 },
        { freq: 1047, duration: 0.06, type: "square", volume: 0.06 },
      ],
      0.02
    ),
  leave: () =>
    playSequence(
      [
        { freq: 523, duration: 0.06, type: "square", volume: 0.05 },
        { freq: 392, duration: 0.08, type: "square", volume: 0.05 },
      ],
      0.02
    ),
  start: () =>
    playSequence(
      [
        { freq: 523, duration: 0.06, type: "triangle", volume: 0.06 },
        { freq: 659, duration: 0.06, type: "triangle", volume: 0.06 },
        { freq: 784, duration: 0.09, type: "triangle", volume: 0.07 },
      ],
      0.03
    ),
  end: () =>
    playSequence(
      [
        { freq: 784, duration: 0.08, type: "sawtooth", volume: 0.06 },
        { freq: 659, duration: 0.08, type: "sawtooth", volume: 0.06 },
        { freq: 523, duration: 0.12, type: "sawtooth", volume: 0.06 },
      ],
      0.03
    ),
  submitValid: () =>
    playSequence(
      [
        { freq: 740, duration: 0.035, type: "triangle", volume: 0.05 },
        { freq: 988, duration: 0.045, type: "triangle", volume: 0.05 },
      ],
      0.015
    ),
  submitInvalid: () =>
    playSequence(
      [
        { freq: 320, duration: 0.05, type: "square", volume: 0.045 },
        { freq: 270, duration: 0.06, type: "square", volume: 0.045 },
      ],
      0.012
    ),
  tick: () => playTone({ freq: 1200, duration: 0.04, type: "square", volume: 0.05 }),
}
