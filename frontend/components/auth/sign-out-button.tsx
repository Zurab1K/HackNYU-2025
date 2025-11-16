'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resetTrainingState } from '@/lib/training-state'

const ONBOARDING_KEYS = ['onboarding_step1', 'onboarding_step2', 'onboarding_step3', 'onboarding_step4', 'onboarding_completed', 'fitstreak_onboarding']

export function SignOutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const shouldHide = pathname === '/' || pathname?.startsWith('/welcome') || pathname?.startsWith('/onboarding')

  if (shouldHide) {
    return null
  }

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      ONBOARDING_KEYS.forEach((key) => window.localStorage.removeItem(key))
    }
    resetTrainingState()
    router.push('/')
  }

  return (
    <div className="fixed top-6 right-6 z-40">
      <Button variant="outline" size="sm" className="rounded-full border-border/70 bg-white/80" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
