import { safeGetItem, safeSetItem } from '@/lib/safe-storage'
import { notifyTrainingStateUpdated } from '@/lib/training-events'
import type { DashboardResponse } from '@/types/dashboard'
import type { ProgressResponse } from '@/types/progress'
import type { ProfileDetails } from '@/types/profile'
import type { WorkoutsResponse, WorkoutSession, WeekPlanEntry, RecommendedWorkout } from '@/types/workouts'
import type { FocusInsight } from '@/types/dashboard'
import type { Achievement, WeeklyCheckIn } from '@/types/dashboard'

const STORAGE_KEY = 'fitstreak.trainingState.v1'

const GOAL_LIBRARY: Record<string, { label: string; focusBlocks: string[] }> = {
  bulk: {
    label: 'Strength & power',
    focusBlocks: ['Compound lifts', 'Accessory push', 'Accessory pull', 'Conditioning reset'],
  },
  lean: {
    label: 'Lean & defined',
    focusBlocks: ['Metabolic circuits', 'Tempo strength', 'Mobility flow', 'Breath reset'],
  },
  fit: {
    label: 'Balanced fitness',
    focusBlocks: ['Strength practice', 'Conditioning ride', 'Mobility play', 'Mindful recovery'],
  },
  flexible: {
    label: 'Mobility & calm',
    focusBlocks: ['Mobility labs', 'Low impact strength', 'Breathwork', 'Restorative flow'],
  },
}

const WORKOUT_LIBRARY: RecommendedWorkout[] = [
  {
    title: 'Loft strength flow',
    focus: 'Bodyweight strength + mobility',
    duration: 25,
    intensity: 'moderate',
    equipment: ['bodyweight', 'mat'],
  },
  {
    title: 'Tempo dumbbell build',
    focus: 'Hybrid upper/lower power',
    duration: 32,
    intensity: 'high',
    equipment: ['dumbbells'],
  },
  {
    title: 'Kettlebell combo session',
    focus: 'Posterior chain & core',
    duration: 28,
    intensity: 'moderate',
    equipment: ['kettlebell'],
  },
  {
    title: 'Bands & breath circuit',
    focus: 'Low impact conditioning',
    duration: 22,
    intensity: 'low',
    equipment: ['bands', 'bodyweight'],
  },
  {
    title: 'Sprint bike intervals',
    focus: 'Conditioning + legs',
    duration: 20,
    intensity: 'high',
    equipment: ['bike'],
  },
  {
    title: 'Grounded mobility reset',
    focus: 'Recovery & mobility',
    duration: 18,
    intensity: 'low',
    equipment: ['mat'],
  },
]

const ACHIEVEMENT_DEFS = [
  {
    id: 'starter-five',
    name: 'First five',
    description: 'Log five workouts with intention.',
    threshold: 5,
    type: 'workout' as const,
  },
  {
    id: 'consistent-ten',
    name: 'Consistency x10',
    description: 'Ten workouts without ghosting.',
    threshold: 10,
    type: 'workout' as const,
  },
  {
    id: 'streak-week',
    name: 'Weeklong streak',
    description: 'Check-in seven days in a row.',
    threshold: 7,
    type: 'streak' as const,
  },
]

type TrainingState = {
  initialized: boolean
  profile: ProfileDetails
  goalId: keyof typeof GOAL_LIBRARY
  equipment: string[]
  stats: {
    level: number
    xp: number
    nextLevelXp: number
    totalWorkouts: number
  }
  streak: {
    current: number
    longest: number
    lastCheckInDate: string | null
    history: Record<string, boolean>
  }
  workouts: {
    recommendedNext: RecommendedWorkout
    weekPlan: WeekPlanEntry[]
    sessions: WorkoutSession[]
  }
  progress: {
    readiness: number
    recovery: number
    trend: number[]
    lifts: ProgressResponse['lifts']
    bodyComposition: ProgressResponse['bodyComposition']
  }
}

export type OnboardingAnswers = {
  name: string
  age: number
  gender: string
  height: number
  weight: number
  bodyStatus: string
  equipment: string[]
  goal: keyof typeof GOAL_LIBRARY
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  daysPerWeek: number
  preferredTime: string
}

export type LogWorkoutInput = {
  title: string
  focus: string
  duration: number
  intensity: 'low' | 'moderate' | 'high'
}

export type LogWorkoutResult = {
  workouts: WorkoutsResponse
  xpEarned: number
  totalXp: number
  level: number
  streak: number
}

export type ProgressLogInput = {
  readiness?: number
  weight?: number
  liftId?: string
  liftValue?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const todayKey = () => new Date().toISOString().slice(0, 10)

const parseState = (): TrainingState | null => {
  const raw = safeGetItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as TrainingState
  } catch {
    return null
  }
}

const persistState = (state: TrainingState) => {
  safeSetItem(STORAGE_KEY, JSON.stringify(state))
}

const persistAndSignal = (state: TrainingState) => {
  persistState(state)
  notifyTrainingStateUpdated()
}

const clearState = () => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('[training-state] Unable to clear state', error)
    }
  }
}

const baseProfile = (answers: OnboardingAnswers): ProfileDetails => ({
  personal: {
    name: answers.name || 'Mover',
    email: `${answers.name?.toLowerCase().replace(/\s+/g, '') || 'member'}@fitstreak.app`,
    age: answers.age,
    gender: answers.gender,
  },
  metrics: {
    height: answers.height,
    weight: answers.weight,
    bodyStatus: answers.bodyStatus || 'Balanced',
  },
  preferences: {
    goalFocus: GOAL_LIBRARY[answers.goal].label,
    preferredSchedule: answers.daysPerWeek,
    preferredTime: answers.preferredTime,
    preferredIntensity: answers.fitnessLevel === 'advanced' ? 'high' : answers.fitnessLevel === 'intermediate' ? 'moderate' : 'low',
  },
})

const getEquipmentFriendlyList = (equipment: string[]) =>
  equipment.length ? equipment.join(', ') : 'bodyweight + minimal gear'

const selectWorkoutForUser = (state: TrainingState): RecommendedWorkout => {
  const available = WORKOUT_LIBRARY.filter((workout) => {
    if (!workout.equipment?.length) return true
    if (state.equipment.includes('bodyweight') && workout.equipment?.includes('bodyweight')) return true
    return workout.equipment?.some((item) => state.equipment.includes(item))
  })
  if (!available.length) return WORKOUT_LIBRARY[0]
  const nextIndex = state.stats.totalWorkouts % available.length
  return available[nextIndex]
}

const buildWeekPlan = (goalId: keyof typeof GOAL_LIBRARY, daysPerWeek: number): WeekPlanEntry[] => {
  const focusBlocks = GOAL_LIBRARY[goalId].focusBlocks
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, index) => {
    if (index < daysPerWeek) {
      return {
        day,
        focus: focusBlocks[index % focusBlocks.length],
        status: 'planned' as const,
      }
    }
    return {
      day,
      focus: 'Recovery & breath',
      status: 'rest' as const,
    }
  })
}

const createInitialState = (answers: OnboardingAnswers): TrainingState => {
  const profile = baseProfile(answers)
  const baseState: TrainingState = {
    initialized: true,
    profile,
    goalId: answers.goal,
    equipment: answers.equipment.length ? answers.equipment : ['bodyweight', 'mat'],
    stats: {
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      totalWorkouts: 0,
    },
    streak: {
      current: 0,
      longest: 0,
      lastCheckInDate: null,
      history: {},
    },
    workouts: {
      recommendedNext: WORKOUT_LIBRARY[0],
      weekPlan: buildWeekPlan(answers.goal, answers.daysPerWeek),
      sessions: [],
    },
    progress: {
      readiness: answers.fitnessLevel === 'advanced' ? 72 : answers.fitnessLevel === 'intermediate' ? 65 : 58,
      recovery: 70,
      trend: [55, 60, 58, 62, 65, 64, 66],
      lifts: [
        { id: 'squat', name: 'Front squat', current: 135, previous: 125 },
        { id: 'press', name: 'Push press', current: 95, previous: 90 },
        { id: 'hinge', name: 'Romanian deadlift', current: 165, previous: 155 },
      ],
      bodyComposition: [
        { label: 'Body fat', value: 18, unit: '%' },
        { label: 'Muscle mass', value: 78, unit: 'lb' },
        { label: 'Weight', value: answers.weight, unit: 'kg' },
      ],
    },
  }

  baseState.workouts.recommendedNext = selectWorkoutForUser(baseState)
  return baseState
}

const ensureState = (): TrainingState => {
  const stored = parseState()
  if (stored?.initialized) {
    return stored
  }
  const fallbackAnswers: OnboardingAnswers = {
    name: 'FitStreak Member',
    age: 27,
    gender: 'Not specified',
    height: 170,
    weight: 70,
    bodyStatus: 'Athletic',
    equipment: ['bodyweight', 'mat'],
    goal: 'fit',
    fitnessLevel: 'intermediate',
    daysPerWeek: 4,
    preferredTime: 'Morning',
  }
  const seeded = createInitialState(fallbackAnswers)
  persistState(seeded)
  return seeded
}

const computeWeeklyStats = (sessions: WorkoutSession[], preferredSchedule: number) => {
  const now = new Date()
  const windowStart = new Date(now)
  windowStart.setDate(windowStart.getDate() - 6)
  const recentSessions = sessions.filter((session) => new Date(session.date) >= windowStart)
  const minutes = recentSessions.reduce((total, session) => total + session.duration, 0)
  const completedThisWeek = recentSessions.length
  const consistency = clamp(Math.round((completedThisWeek / preferredSchedule) * 100), 0, 100)
  return {
    completedThisWeek,
    minutesThisWeek: minutes,
    consistency,
  }
}

const buildWeeklyCheckIns = (state: TrainingState): WeeklyCheckIn[] => {
  const entries: WeeklyCheckIn[] = []
  const today = new Date()
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const key = date.toISOString().slice(0, 10)
    const label = date.toLocaleDateString('en-US', { weekday: 'short' })
    entries.push({
      date: key,
      label,
      completed: Boolean(state.streak.history[key]),
    })
  }
  return entries
}

const buildAchievements = (state: TrainingState): Achievement[] => {
  return ACHIEVEMENT_DEFS.map((achievement) => {
    const currentValue = achievement.type === 'workout' ? state.stats.totalWorkouts : state.streak.longest
    const progressPercent = clamp((currentValue / achievement.threshold) * 100, 0, 100)
    return {
      ...achievement,
      currentValue,
      progressPercent,
      unlocked: currentValue >= achievement.threshold,
    }
  })
}

const buildFocusInsights = (state: TrainingState): FocusInsight[] => {
  return [
    {
      title: `${state.profile.preferences.goalFocus}`,
      description: `We rotate ${GOAL_LIBRARY[state.goalId].focusBlocks.join(', ')} across ${state.profile.preferences.preferredSchedule} sessions.`,
    },
    {
      title: 'Equipment smart',
      description: `Programming leans on ${getEquipmentFriendlyList(state.equipment)}.`,
    },
    {
      title: `Preferred ${state.profile.preferences.preferredTime.toLowerCase()}`,
      description: `Expect gentle reminders before your ${state.profile.preferences.preferredTime.toLowerCase()} focus block.`,
    },
  ]
}

const buildDashboardResponse = (state: TrainingState): DashboardResponse => ({
  profile: {
    name: state.profile.personal.name,
    level: state.stats.level,
    xp: state.stats.xp,
    nextLevelXp: state.stats.nextLevelXp,
    currentGoal: state.profile.preferences.goalFocus,
    totalWorkouts: state.stats.totalWorkouts,
  },
  streak: {
    current: state.streak.current,
    longest: state.streak.longest,
    hasCheckedInToday: state.streak.lastCheckInDate === todayKey(),
    checkIns: buildWeeklyCheckIns(state),
  },
  workouts: {
    total: state.stats.totalWorkouts,
    recommendedNext: {
      title: state.workouts.recommendedNext.title,
      focus: state.workouts.recommendedNext.focus,
      duration: state.workouts.recommendedNext.duration,
    },
    weekPlan: state.workouts.weekPlan,
  },
  achievements: buildAchievements(state),
  focus: buildFocusInsights(state),
})

const buildProgressResponse = (state: TrainingState): ProgressResponse => ({
  readiness: Math.round(state.progress.readiness),
  recovery: Math.round(state.progress.recovery),
  trend: state.progress.trend,
  milestones: [
    { label: 'Energy', value: clamp(state.progress.readiness, 40, 100), delta: 2 },
    { label: 'Focus', value: clamp(state.progress.recovery, 35, 100), delta: 1 },
    { label: 'Recovery', value: clamp(state.progress.recovery - 2, 30, 100), delta: -1 },
  ],
  lifts: state.progress.lifts,
  bodyComposition: state.progress.bodyComposition,
})

const buildWorkoutsResponse = (state: TrainingState): WorkoutsResponse => ({
  recommendedNext: state.workouts.recommendedNext,
  weekPlan: state.workouts.weekPlan,
  sessions: state.workouts.sessions,
  stats: computeWeeklyStats(state.workouts.sessions, state.profile.preferences.preferredSchedule),
})

const awardXp = (state: TrainingState, amount: number) => {
  state.stats.xp += amount
  while (state.stats.xp >= state.stats.nextLevelXp) {
    state.stats.xp -= state.stats.nextLevelXp
    state.stats.level += 1
    state.stats.nextLevelXp = Math.round(state.stats.nextLevelXp * 1.2)
  }
}

const updateProgressFromWorkout = (state: TrainingState, input: LogWorkoutInput) => {
  const impact = input.intensity === 'high' ? 3 : input.intensity === 'moderate' ? 2 : 1
  state.progress.readiness = clamp(state.progress.readiness + impact, 40, 95)
  state.progress.recovery = clamp(state.progress.recovery - impact + 1, 35, 100)
  const nextTrend = [...state.progress.trend.slice(-6), state.progress.readiness]
  state.progress.trend = nextTrend
  state.progress.lifts = state.progress.lifts.map((lift, index) => ({
    ...lift,
    previous: lift.current,
    current: clamp(lift.current + (index === 0 ? impact : impact - 1), 20, 400),
  }))
}

const updateWeekPlanAfterWorkout = (state: TrainingState, focus: string) => {
  const plannedIndex = state.workouts.weekPlan.findIndex((entry) => entry.status === 'planned')
  if (plannedIndex !== -1) {
    state.workouts.weekPlan[plannedIndex] = {
      ...state.workouts.weekPlan[plannedIndex],
      status: 'complete',
    }
  } else {
    const restIndex = state.workouts.weekPlan.findIndex((entry) => entry.status === 'rest')
    if (restIndex !== -1) {
      state.workouts.weekPlan[restIndex] = {
        ...state.workouts.weekPlan[restIndex],
        status: 'complete',
        focus,
      }
    }
  }
  state.workouts.recommendedNext = selectWorkoutForUser(state)
}

export const completeOnboardingState = (answers: OnboardingAnswers) => {
  const next = createInitialState(answers)
  persistAndSignal(next)
  return next
}

export const getDashboardData = (): DashboardResponse => buildDashboardResponse(ensureState())

export const checkInToday = (): DashboardResponse => {
  const state = ensureState()
  const today = todayKey()
  if (state.streak.lastCheckInDate === today) {
    return buildDashboardResponse(state)
  }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)
  if (state.streak.lastCheckInDate === yesterdayKey) {
    state.streak.current += 1
  } else {
    state.streak.current = 1
  }
  state.streak.longest = Math.max(state.streak.longest, state.streak.current)
  state.streak.lastCheckInDate = today
  state.streak.history[today] = true
  awardXp(state, 25)
  persistAndSignal(state)
  return buildDashboardResponse(state)
}

export const getWorkoutsData = (): WorkoutsResponse => buildWorkoutsResponse(ensureState())

export const logWorkoutSession = (input: LogWorkoutInput): LogWorkoutResult => {
  const state = ensureState()
  const intensityFactor = input.intensity === 'high' ? 6 : input.intensity === 'moderate' ? 4 : 2
  const xpEarned = Math.max(10, Math.round(input.duration * intensityFactor))
  const caloriesPerMinute = input.intensity === 'high' ? 11 : input.intensity === 'moderate' ? 8 : 6
  const entry: WorkoutSession = {
    id: `${Date.now()}`,
    title: input.title,
    focus: input.focus,
    duration: input.duration,
    calories: input.duration * caloriesPerMinute,
    status: 'complete',
    intensity: input.intensity,
    date: new Date().toISOString(),
  }
  state.workouts.sessions = [entry, ...state.workouts.sessions].slice(0, 20)
  state.stats.totalWorkouts += 1
  awardXp(state, xpEarned)
  updateProgressFromWorkout(state, input)
  updateWeekPlanAfterWorkout(state, input.focus)
  persistAndSignal(state)
  return {
    workouts: buildWorkoutsResponse(state),
    xpEarned,
    totalXp: state.stats.xp,
    level: state.stats.level,
    streak: state.streak.current,
  }
}

export const logProgressMetrics = (input: ProgressLogInput): ProgressResponse => {
  const state = ensureState()

  if (typeof input.readiness === 'number' && !Number.isNaN(input.readiness)) {
    state.progress.readiness = clamp(input.readiness, 1, 100)
    state.progress.trend = [...state.progress.trend.slice(-6), state.progress.readiness]
    state.progress.recovery = clamp(state.progress.readiness - 2, 35, 100)
  }

  if (typeof input.weight === 'number' && !Number.isNaN(input.weight)) {
    const weightEntry = state.progress.bodyComposition.find((entry) => entry.label.toLowerCase() === 'weight')
    if (weightEntry) {
      weightEntry.value = Number(input.weight)
    } else {
      state.progress.bodyComposition.push({ label: 'Weight', value: Number(input.weight), unit: 'kg' })
    }
  }

  if (input.liftId && typeof input.liftValue === 'number' && !Number.isNaN(input.liftValue)) {
    state.progress.lifts = state.progress.lifts.map((lift) =>
      lift.id === input.liftId
        ? { ...lift, previous: lift.current, current: Math.max(0, Math.round(input.liftValue)) }
        : lift,
    )
  }

  persistAndSignal(state)
  return buildProgressResponse(state)
}

export const getProgressData = (): ProgressResponse => buildProgressResponse(ensureState())

export const getProfileDetails = (): ProfileDetails => ensureState().profile

export const updateProfileDetails = (profile: ProfileDetails): ProfileDetails => {
  const state = ensureState()
  state.profile = profile
  persistAndSignal(state)
  return state.profile
}

export const resetTrainingState = () => {
  clearState()
  notifyTrainingStateUpdated()
}
