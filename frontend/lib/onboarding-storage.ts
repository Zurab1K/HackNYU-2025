export type OnboardingPersonal = {
  name: string
  age: string
  gender: string
}

export type OnboardingMetrics = {
  height: string
  weight: string
  bodyStatus: string
  experience: 'beginner' | 'intermediate' | 'advanced' | ''
}

export type OnboardingGoals = {
  goal: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | ''
  daysPerWeek: string
  preferredTime: string
  preferredIntensity: 'low' | 'moderate' | 'high' | ''
}

export type OnboardingState = {
  personal: OnboardingPersonal
  metrics: OnboardingMetrics
  goals: OnboardingGoals
}

const STORAGE_KEY = 'fitstreak_onboarding'

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  personal: {
    name: '',
    age: '',
    gender: '',
  },
  metrics: {
    height: '',
    weight: '',
    bodyStatus: '',
    experience: '',
  },
  goals: {
    goal: '',
    fitnessLevel: '',
    daysPerWeek: '',
    preferredTime: '',
    preferredIntensity: '',
  },
}

const mergeStates = (next: Partial<OnboardingState>, current: OnboardingState) => ({
  personal: { ...current.personal, ...next.personal },
  metrics: { ...current.metrics, ...next.metrics },
  goals: { ...current.goals, ...next.goals },
})

export const readOnboardingState = (): OnboardingState => {
  if (typeof window === 'undefined') return DEFAULT_ONBOARDING_STATE
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_ONBOARDING_STATE

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingState>
    return mergeStates(parsed, DEFAULT_ONBOARDING_STATE)
  } catch {
    return DEFAULT_ONBOARDING_STATE
  }
}

export const writeOnboardingState = (partial: Partial<OnboardingState>) => {
  if (typeof window === 'undefined') return DEFAULT_ONBOARDING_STATE
  const next = mergeStates(partial, readOnboardingState())
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export const clearOnboardingState = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
