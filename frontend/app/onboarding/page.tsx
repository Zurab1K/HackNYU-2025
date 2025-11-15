'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step 1 of 4</span>
            <span className="text-sm text-muted-foreground">Personal Info</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4 transition-all duration-300 rounded-full" />
          </div>
        </div>

        <Card className="p-8 border border-border shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
              Let's get to know you
            </h1>
            <p className="text-muted-foreground">
              We'll use this to personalize your experience
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                What's your name?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-background border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                How old are you?
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="h-11 bg-background border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`h-11 rounded-lg font-medium text-sm transition-all ${
                      formData.gender === gender
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            className="w-full h-11 text-base mt-8 bg-primary hover:bg-primary/90"
            onClick={handleContinue}
            disabled={!isFormValid}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
