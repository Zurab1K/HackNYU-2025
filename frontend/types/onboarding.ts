import type { OnboardingState } from '@/lib/onboarding-storage'

export type OnboardingPayload = {
  personal: {
    name: string
    age: number
    gender: string
  }
  metrics: {
    height: number
    weight: number
    experience: 'beginner' | 'intermediate' | 'advanced'
  }
  goals: {
    goalFocus: string
    preferredSchedule: number
    preferredIntensity: 'low' | 'moderate' | 'high'
  }
}

export const mapStateToPayload = (state: OnboardingState): OnboardingPayload => ({
  personal: {
    name: state.personal.name.trim(),
    age: Number(state.personal.age),
    gender: state.personal.gender,
  },
  metrics: {
    height: Number(state.metrics.height),
    weight: Number(state.metrics.weight),
    experience: (state.metrics.experience || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
  },
  goals: {
    goalFocus: state.goals.goal || 'Stay Fit',
    preferredSchedule: Number(state.goals.daysPerWeek || 4),
    preferredIntensity: (state.goals.preferredIntensity || 'moderate') as 'low' | 'moderate' | 'high',
  },
})
