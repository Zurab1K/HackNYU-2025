'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, ArrowLeft, Sparkles } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step 4 of 4</span>
            <span className="text-sm text-muted-foreground">Schedule</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full transition-all duration-300 rounded-full" />
          </div>
        </div>

        <Card className="p-8 border border-border shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
              Your schedule
            </h1>
            <p className="text-muted-foreground">
              When can you work out?
            </p>
          </div>

          <div className="space-y-6">
            {/* Days Per Week Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Days per week</Label>
              <div className="grid grid-cols-2 gap-3">
                {daysOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, daysPerWeek: option.value })}
                    className={`p-4 rounded-lg text-left transition-all ${
                      formData.daysPerWeek === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <div className="font-semibold text-lg mb-0.5">{option.label}</div>
                    <div className={`text-sm ${
                      formData.daysPerWeek === option.value 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {option.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Preferred time</Label>
              <div className="space-y-2">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredTime: option.value })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.preferredTime === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <div className="font-semibold mb-0.5">{option.label}</div>
                    <div className={`text-sm ${
                      formData.preferredTime === option.value 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {option.time}
                    </div>
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
              onClick={handleComplete}
              disabled={!isFormValid}
            >
              Complete
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
