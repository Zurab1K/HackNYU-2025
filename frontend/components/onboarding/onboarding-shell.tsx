import type { ReactNode } from 'react'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Card } from '@/components/ui/card'

export type OnboardingShellProps = {
  step: number
  totalSteps?: number
  label: string
  title: string
  description: string
  children: ReactNode
}

export function OnboardingShell({ step, totalSteps = 4, label, title, description, children }: OnboardingShellProps) {
  const progress = Math.round((step / totalSteps) * 100)

  return (
    <AmbientBackground className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="space-y-3 px-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{progress}%</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{label}</span>
          </div>
          <div className="h-1 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Card className="space-y-8 p-10">
          <div className="space-y-3 text-balance">
            <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>
          {children}
        </Card>
      </div>
    </AmbientBackground>
  )
}
