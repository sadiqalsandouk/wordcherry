import { WebHaptics } from "web-haptics"

const instance = typeof window !== "undefined" ? new WebHaptics() : null

const trigger: WebHaptics["trigger"] = (...args) => instance?.trigger(...args)

export const haptics = {
  tap: () => trigger("selection"),
  submitValid: () => trigger("success"),
  submitInvalid: () => trigger("error"),
  start: () => trigger("medium"),
  end: () => trigger("nudge"),
  tick: () => trigger("rigid"),
  join: () => trigger("light"),
  leave: () => trigger("light"),
}
