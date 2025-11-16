export type WeeklyCheckIn = {
  date: string
  label: string
  completed: boolean
}

export type WeekPlanEntry = {
  day: string
  focus: string
  status: 'planned' | 'complete' | 'rest'
}

export type RecommendedWorkout = {
  title: string
  focus: string
  duration: number
}

export type FocusInsight = {
  title: string
  description: string
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
