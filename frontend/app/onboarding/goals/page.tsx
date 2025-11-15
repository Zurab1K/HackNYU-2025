'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Target, Flame, Dumbbell, Heart, ArrowRight, ArrowLeft, Zap } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step 3 of 4</span>
            <span className="text-sm text-muted-foreground">Goals</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 transition-all duration-300 rounded-full" />
          </div>
        </div>

        <Card className="p-8 border border-border shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
              What's your goal?
            </h1>
            <p className="text-muted-foreground">
              Choose what you want to achieve
            </p>
          </div>

          <div className="space-y-6">
            {/* Goal Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Primary goal</Label>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal: goal.id })}
                      className={`p-5 rounded-lg transition-all ${
                        formData.goal === goal.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium text-sm">{goal.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fitness Level Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Experience level</Label>
              <div className="space-y-2">
                {fitnessLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, fitnessLevel: level.id })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.fitnessLevel === level.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <div className="font-semibold mb-0.5">{level.name}</div>
                    <div className={`text-sm ${
                      formData.fitnessLevel === level.id 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {level.description}
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
