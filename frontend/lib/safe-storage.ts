export const safeGetItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`[storage] Unable to read key "${key}":`, error)
    return null
  }
}

export const safeSetItem = (key: string, value: string) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`[storage] Unable to persist key "${key}":`, error)
  }
}
