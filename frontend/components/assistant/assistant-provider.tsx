'use client'

import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const AssistantContext = createContext<{
  open: boolean
  setOpen: (value: boolean) => void
} | null>(null)

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const completed = typeof window !== 'undefined' ? window.localStorage.getItem('onboarding_completed') : null
    if (completed === 'true') {
      setOpen(true)
    }
  }, [])
  const value = useMemo(() => ({ open, setOpen }), [open])
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export const useAssistant = () => {
  const ctx = useContext(AssistantContext)
  if (!ctx) {
    throw new Error('useAssistant must be used within AssistantProvider')
  }
  return ctx
}
