'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'
import { completeOnboardingState, type OnboardingAnswers } from '@/lib/training-state'

export default function OnboardingStep4() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    daysPerWeek: '',
    preferredTime: ''
  })

  useEffect(() => {
    const step3Data = localStorage.getItem('onboarding_step3')
    if (!step3Data) {
      router.push('/onboarding')
    }
  }, [router])

  const handleComplete = () => {
    if (formData.daysPerWeek && formData.preferredTime) {
      localStorage.setItem('onboarding_step4', JSON.stringify(formData))
      localStorage.setItem('onboarding_completed', 'true')
      const answers = buildAnswers()
      if (answers) {
        completeOnboardingState(answers)
      }
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const isFormValid = formData.daysPerWeek && formData.preferredTime

  const daysOptions = [
    { value: '3', label: '3 days', subtitle: 'Beginner friendly' },
    { value: '4', label: '4 days', subtitle: 'Balanced' },
    { value: '5', label: '5 days', subtitle: 'Committed' },
    { value: '6', label: '6+ days', subtitle: 'Advanced' }
  ]

  const timeOptions = [
    { value: 'morning', label: 'Morning', time: '6AM - 10AM' },
    { value: 'afternoon', label: 'Afternoon', time: '12PM - 4PM' },
    { value: 'evening', label: 'Evening', time: '5PM - 8PM' },
    { value: 'night', label: 'Night', time: '8PM - 11PM' }
  ]

  const buildAnswers = (): OnboardingAnswers | null => {
    const step1Raw = localStorage.getItem('onboarding_step1')
    const step2Raw = localStorage.getItem('onboarding_step2')
    const step3Raw = localStorage.getItem('onboarding_step3')
    if (!step1Raw || !step2Raw || !step3Raw) {
      return null
    }
    try {
      const step1 = JSON.parse(step1Raw) as { name: string; age: string; gender: string }
      const step2 = JSON.parse(step2Raw) as { height: string; weight: string; bodyStatus: string; equipment?: string[] }
      const step3 = JSON.parse(step3Raw) as { goal: OnboardingAnswers['goal']; fitnessLevel: OnboardingAnswers['fitnessLevel'] }
      return {
        name: step1.name,
        age: Number(step1.age) || 0,
        gender: step1.gender || 'Not specified',
        height: Number(step2.height) || 170,
        weight: Number(step2.weight) || 70,
        bodyStatus: step2.bodyStatus || 'Balanced',
        equipment: Array.isArray(step2.equipment) && step2.equipment.length ? step2.equipment : ['bodyweight', 'mat'],
        goal: step3.goal || 'fit',
        fitnessLevel: step3.fitnessLevel || 'intermediate',
        daysPerWeek: Number(formData.daysPerWeek),
        preferredTime: timeOptions.find((option) => option.value === formData.preferredTime)?.label || 'Morning',
      }
    } catch {
      return null
    }
  }

  return (
    <OnboardingShell
      step={4}
      label="Schedule"
      title="Design your week"
      description="We align reminders and recovery recaps to the rhythm you can keep."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Days per week</Label>
          <div className="grid grid-cols-2 gap-3">
            {daysOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, daysPerWeek: option.value })}
                className={`rounded-2xl border p-4 text-left transition ${
                  formData.daysPerWeek === option.value
                    ? 'border-primary/60 bg-primary text-primary-foreground shadow-lg'
                    : 'border-border/70 bg-white/70 text-foreground hover:border-primary/40'
                }`}
              >
                <div className="text-lg font-semibold">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Preferred time</Label>
          <div className="space-y-2">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, preferredTime: option.value })}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  formData.preferredTime === option.value
                    ? 'border-primary/60 bg-primary text-primary-foreground shadow-lg'
                    : 'border-border/70 bg-white/70 text-foreground hover:border-primary/40'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.time}</div>
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
            onClick={handleComplete}
            disabled={!isFormValid}
          >
            Complete
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
