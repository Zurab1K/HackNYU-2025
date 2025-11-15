'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function OnboardingStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bodyStatus: ''
  })

  useEffect(() => {
    const step1Data = localStorage.getItem('onboarding_step1')
    if (!step1Data) {
      router.push('/onboarding')
    }
  }, [router])

  const handleContinue = () => {
    if (formData.height && formData.weight && formData.bodyStatus) {
      localStorage.setItem('onboarding_step2', JSON.stringify(formData))
      router.push('/onboarding/goals')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const isFormValid = formData.height && formData.weight && formData.bodyStatus

  const bodyStatuses = [
    'Underweight',
    'Normal',
    'Overweight',
    'Athletic'
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step 2 of 4</span>
            <span className="text-sm text-muted-foreground">Body Metrics</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/4 transition-all duration-300 rounded-full" />
          </div>
        </div>

        <Card className="p-8 border border-border shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
              Your body metrics
            </h1>
            <p className="text-muted-foreground">
              Help us understand your starting point
            </p>
          </div>

          <div className="space-y-6">
            {/* Height and Weight Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="h-11 bg-background border-border focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="h-11 bg-background border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Body Status Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current body type</Label>
              <div className="grid grid-cols-2 gap-3">
                {bodyStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, bodyStatus: status })}
                    className={`h-11 rounded-lg font-medium text-sm transition-all ${
                      formData.bodyStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              size="lg"
              className="flex-1 h-11 bg-primary hover:bg-primary/90"
              onClick={handleContinue}
              disabled={!isFormValid}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
