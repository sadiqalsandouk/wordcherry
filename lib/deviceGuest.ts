const KEY = "wc.deviceGuest"

type DeviceGuest = {
  user_id: string
  refresh_token: string
  access_token: string
}

export function saveDeviceGuest(s: DeviceGuest) {
  const existing = getDeviceGuest()
  if (!existing || existing.user_id === s.user_id) {
    localStorage.setItem(KEY, JSON.stringify(s))
  }
}

export function getDeviceGuest(): DeviceGuest | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DeviceGuest
  } catch {
    return null
  }
}

export function clearDeviceGuest() {
  localStorage.removeItem(KEY)
}
