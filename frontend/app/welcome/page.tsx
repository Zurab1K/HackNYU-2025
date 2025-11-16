'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { AmbientBackground } from '@/components/layout/ambient-background'

const welcomeHighlights = [
  'Evidence-based strength and breath protocols',
  'Weekly check-ins with tone-matching prompts',
  'Full transparency over recovery and readiness',
]

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('friend')

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    if (name) {
      setUserName(name.split(' ')[0])
    }
  }, [])

  return (
    <AmbientBackground className="flex items-center justify-center px-4 py-12">
      <Card className="max-w-3xl space-y-10 p-10 text-left">
        <div className="flex items-center gap-3 rounded-full border border-border/50 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Personalize
        </div>

        <div className="space-y-4 text-balance">
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {userName}, let’s shape a routine that moves like you do.
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            A two-minute intake so our coaches can tune your recovery, intensity, and flow without guessing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {welcomeHighlights.map((highlight) => (
            <div key={highlight} className="rounded-2xl border border-border/60 bg-white/70 p-4 text-sm text-muted-foreground shadow-inner">
              {highlight}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            size="lg"
            className="h-12 rounded-full px-8 text-base font-semibold"
            onClick={() => router.push('/onboarding')}
          >
            Begin onboarding
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">2 minutes • saves automatically</p>
        </div>
      </Card>
    </AmbientBackground>
  )
}
