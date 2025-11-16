'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Target, Flame, Dumbbell, Heart, ArrowRight, ArrowLeft, Zap } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'

export default function OnboardingStep3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    goal: '',
    fitnessLevel: ''
  })

  useEffect(() => {
    const step2Data = localStorage.getItem('onboarding_step2')
    if (!step2Data) {
      router.push('/onboarding')
    }
  }, [router])

  const handleContinue = () => {
    if (formData.goal && formData.fitnessLevel) {
      localStorage.setItem('onboarding_step3', JSON.stringify(formData))
      router.push('/onboarding/preferences')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const isFormValid = formData.goal && formData.fitnessLevel

  const goals = [
    { id: 'bulk', name: 'Build Muscle', icon: Dumbbell },
    { id: 'lean', name: 'Get Lean', icon: Flame },
    { id: 'fit', name: 'Stay Fit', icon: Heart },
    { id: 'flexible', name: 'Flexibility', icon: Zap }
  ]

  const fitnessLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Just starting out' },
    { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
    { id: 'advanced', name: 'Advanced', description: 'Very experienced' }
  ]

  return (
    <OnboardingShell
      step={3}
      label="Goals"
      title="What are you working toward?"
      description="This shapes the tone of your programming, nudges, and progress recaps."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Primary goal</Label>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => {
              const Icon = goal.icon
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: goal.id })}
                  className={`rounded-2xl border p-5 transition ${
                    formData.goal === goal.id
                      ? 'border-primary/60 bg-primary text-primary-foreground shadow-lg'
                      : 'border-border/70 bg-white/70 text-foreground hover:border-primary/40'
                  }`}
                >
                  <Icon className="mx-auto mb-3 h-6 w-6" />
                  <div className="text-sm font-semibold">{goal.name}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Experience level</Label>
          <div className="space-y-2">
            {fitnessLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setFormData({ ...formData, fitnessLevel: level.id })}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  formData.fitnessLevel === level.id
                    ? 'border-primary/60 bg-primary text-primary-foreground shadow-lg'
                    : 'border-border/70 bg-white/70 text-foreground hover:border-primary/40'
                }`}
              >
                <div className="font-semibold">{level.name}</div>
                <div className="text-sm text-muted-foreground">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            size="lg"
            className="h-12 flex-1 rounded-full text-base font-semibold"
            onClick={handleContinue}
            disabled={!isFormValid}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
