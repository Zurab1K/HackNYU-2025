export type WeekPlanEntry = {
  day: string
  focus: string
  status: 'planned' | 'complete' | 'rest'
}

export type WorkoutSession = {
  id: string
  title: string
  date: string
  duration: number
  calories: number
  status: 'complete' | 'planned'
  focus: string
  intensity: 'low' | 'moderate' | 'high'
}

export type RecommendedWorkout = {
  title: string
  focus: string
  duration: number
  intensity?: 'low' | 'moderate' | 'high'
  equipment?: string[]
}

export type WorkoutsResponse = {
  recommendedNext: RecommendedWorkout
  weekPlan: WeekPlanEntry[]
  sessions: WorkoutSession[]
  stats: {
    completedThisWeek: number
    minutesThisWeek: number
    consistency: number
  }
}
