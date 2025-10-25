export const DEVICE_TOKEN_KEY = "wc.deviceToken"

export function getOrCreateDeviceToken() {
  let t = localStorage.getItem(DEVICE_TOKEN_KEY)
  if (!t) {
    t = crypto
      .getRandomValues(new Uint8Array(16))
      .reduce((s, b) => s + b.toString(16).padStart(2, "0"), "")
    localStorage.setItem(DEVICE_TOKEN_KEY, t)
  }
  return t
}
