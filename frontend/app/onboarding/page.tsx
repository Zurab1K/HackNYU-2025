'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'

export default function OnboardingStep1() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  })

  const handleContinue = () => {
    if (formData.name && formData.age && formData.gender) {
      localStorage.setItem('onboarding_step1', JSON.stringify(formData))
      router.push('/onboarding/body-metrics')
    }
  }

  const isFormValid = formData.name && formData.age && formData.gender

  return (
    <OnboardingShell
      step={1}
      label="Personal info"
      title="Let’s get to know you"
      description="A few details to cue the right language, pacing, and accountability reminders."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            What's your name?
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-2xl border border-border/70 bg-white/80 px-4 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-foreground">
            How old are you?
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="h-12 rounded-2xl border border-border/70 bg-white/80 px-4 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Gender</Label>
          <div className="grid grid-cols-3 gap-3">
            {['Male', 'Female', 'Other'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => setFormData({ ...formData, gender })}
                className={`h-12 rounded-2xl text-sm font-semibold transition ${
                  formData.gender === gender
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'border border-border/70 bg-white/70 text-foreground hover:border-primary/50'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          className="mt-4 h-12 w-full rounded-full text-base font-semibold"
          onClick={handleContinue}
          disabled={!isFormValid}
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </OnboardingShell>
  )
}
