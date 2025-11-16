'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'

const equipmentOptions = [
  { value: 'bodyweight', label: 'Bodyweight + mat' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'bands', label: 'Resistance bands' },
  { value: 'bike', label: 'Bike / erg' },
]

export default function OnboardingStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bodyStatus: '',
    equipment: [] as string[],
  })

  useEffect(() => {
    const step1Data = localStorage.getItem('onboarding_step1')
    if (!step1Data) {
      router.push('/onboarding')
      return
    }
    localStorage.removeItem('onboarding_step2')
  }, [router])

  const toggleEquipment = (value: string) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(value)
      return {
        ...prev,
        equipment: exists ? prev.equipment.filter((item) => item !== value) : [...prev.equipment, value],
      }
    })
  }

  const handleContinue = () => {
    if (formData.height && formData.weight && formData.bodyStatus) {
      localStorage.setItem('onboarding_step2', JSON.stringify(formData))
      router.push('/onboarding/goals')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const isFormValid = formData.height && formData.weight && formData.bodyStatus && formData.equipment.length > 0

  const bodyStatuses = [
    'Underweight',
    'Normal',
    'Overweight',
    'Athletic'
  ]

  return (
    <OnboardingShell
      step={2}
      label="Body metrics"
      title="Where you’re starting from"
      description="These numbers guide pacing, recovery, and how bold we go with load progression."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-foreground">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="h-12 rounded-2xl border border-border/70 bg-white/80 px-4 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-foreground">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="h-12 rounded-2xl border border-border/70 bg-white/80 px-4 text-base"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Current body type</Label>
          <div className="grid grid-cols-2 gap-3">
            {bodyStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData({ ...formData, bodyStatus: status })}
                className={`h-12 rounded-2xl text-sm font-semibold transition ${
                  formData.bodyStatus === status
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'border border-border/70 bg-white/70 text-foreground hover:border-primary/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Equipment you have access to</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {equipmentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleEquipment(option.value)}
                className={`rounded-2xl border p-4 text-left text-sm transition ${
                  formData.equipment.includes(option.value)
                    ? 'border-primary/60 bg-primary text-primary-foreground shadow-lg'
                    : 'border-border/70 bg-white/70 text-foreground hover:border-primary/40'
                }`}
              >
                {option.label}
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
