const EVENT_NAME = 'training-state-updated'

export const notifyTrainingStateUpdated = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(EVENT_NAME))
}

export const subscribeTrainingStateUpdates = (handler: () => void) => {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}
