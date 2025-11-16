export type WeekPlanEntry = {
  day: string
  focus: string
  status: 'planned' | 'complete' | 'rest'
}

export type RecommendedWorkout = {
  title: string
  focus: string
  duration: number
  equipment?: string[]
  intensity?: 'low' | 'moderate' | 'high'
}

export type FocusInsight = {
  title: string
  description: string
}

export type WeeklyCheckIn = {
  date: string
  label: string
  completed: boolean
}

export type Achievement = {
  id: string
  name: string
  description: string
  threshold: number
  type: 'workout' | 'streak'
  currentValue: number
  progressPercent: number
  unlocked: boolean
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

export type ProgressLift = {
  id: string
  name: string
  current: number
  previous: number
}

export type ProgressMilestone = {
  label: string
  value: number
  delta: number
}

export type ProgressResponse = {
  readiness: number
  recovery: number
  trend: number[]
  milestones: ProgressMilestone[]
  lifts: ProgressLift[]
  bodyComposition: {
    label: string
    value: number
    unit: string
  }[]
}

export type DashboardResponse = {
  profile: {
    name: string
    level: number
    xp: number
    nextLevelXp: number
    currentGoal: string
    totalWorkouts: number
  }
  streak: {
    current: number
    longest: number
    hasCheckedInToday: boolean
    checkIns: WeeklyCheckIn[]
  }
  workouts: {
    total: number
    recommendedNext: RecommendedWorkout
    weekPlan: WeekPlanEntry[]
  }
  achievements: Achievement[]
  focus: FocusInsight[]
}

export type PersonalInfo = {
  name: string
  age: number
  gender: string
}

export type BodyMetrics = {
  height: number
  weight: number
  experience: 'beginner' | 'intermediate' | 'advanced'
}

export type GoalPreferences = {
  goalFocus: string
  preferredSchedule: number
  preferredIntensity: 'low' | 'moderate' | 'high'
}

export type OnboardingSubmission = {
  personal: PersonalInfo
  metrics: BodyMetrics
  goals: GoalPreferences
}

export type ProfileDetails = {
  personal: {
    name: string
    email: string
    age: number
    gender: string
  }
  metrics: {
    height: number
    weight: number
    bodyStatus: string
  }
  preferences: {
    goalFocus: string
    preferredSchedule: number
    preferredTime: string
    preferredIntensity: 'low' | 'moderate' | 'high'
  }
}
