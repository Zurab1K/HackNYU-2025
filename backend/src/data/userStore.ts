import type { SessionUser } from '../auth/passport'
import {
  Achievement,
  DashboardResponse,
  FocusInsight,
  GoalPreferences,
  OnboardingSubmission,
  PersonalInfo,
  ProgressResponse,
  RecommendedWorkout,
  WeekPlanEntry,
  WeeklyCheckIn,
  WorkoutsResponse,
  WorkoutSession,
  BodyMetrics,
  ProfileDetails,
} from '../types/api'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_TABLE = process.env.SUPABASE_TABLE ?? 'user_data'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. API calls will fail until set.')
}

type StoredUserData = {
  profile: {
    id: string
    name: string
    email?: string
    level: number
    xp: number
    nextLevelXp: number
    currentGoal: string
    totalWorkouts: number
    longestStreak: number
  }
  workouts: {
    total: number
    recommendedNext: RecommendedWorkout
    weekPlan: WeekPlanEntry[]
    sessions: WorkoutSession[]
  }
  checkIns: WeeklyCheckIn[]
  streak: {
    current: number
    longest: number
    lastCheckIn: string | null
  }
  focusAreas: FocusInsight[]
  onboarding: OnboardingSubmission | null
  metrics: BodyMetrics & { bodyStatus: string }
  preferences: GoalPreferences & { preferredTime: string }
  progress: ProgressResponse
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

const supabaseHeaders = () => ({
  apikey: SUPABASE_SERVICE_ROLE_KEY ?? '',
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
})

const supabaseFetch = async (path: string, init?: RequestInit) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not set')
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(),
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`[supabase] ${response.status} ${text}`)
  }

  return response
}

const formatIsoDate = (date: Date = new Date()) => {
  const normalized = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  return normalized.toISOString().split('T')[0]
}

const formatWeekdayLabel = (isoDate: string, isToday: boolean) => {
  if (isToday) return 'Today'
  const [year, month, day] = isoDate.split('-').map(Number)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))
  return parsedDate.toLocaleDateString('en-US', { weekday: 'short' })
}

const createInitialCheckIns = (): WeeklyCheckIn[] => {
  const today = new Date()
  const entries: WeeklyCheckIn[] = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today)
    day.setUTCDate(day.getUTCDate() - i)
    const iso = formatIsoDate(day)
    entries.push({
      date: iso,
      label: formatWeekdayLabel(iso, i === 0),
      completed: i > 2,
    })
  }
  return entries
}

const defaultSessions: WorkoutSession[] = [
  {
    id: 'sess-1',
    title: 'Pull + Conditioning',
    date: formatIsoDate(new Date(Date.now() - MS_PER_DAY)),
    duration: 42,
    calories: 410,
    status: 'complete',
    focus: 'Pull strength',
    intensity: 'high',
  },
  {
    id: 'sess-2',
    title: 'Mobility Recharge',
    date: formatIsoDate(new Date(Date.now() - MS_PER_DAY * 2)),
    duration: 25,
    calories: 140,
    status: 'complete',
    focus: 'Mobility',
    intensity: 'low',
  },
  {
    id: 'sess-3',
    title: 'Lower Body Power',
    date: formatIsoDate(new Date(Date.now() - MS_PER_DAY * 3)),
    duration: 50,
    calories: 480,
    status: 'complete',
    focus: 'Leg strength',
    intensity: 'high',
  },
  {
    id: 'sess-4',
    title: 'Tempo Ride',
    date: formatIsoDate(new Date(Date.now() - MS_PER_DAY * 4)),
    duration: 35,
    calories: 320,
    status: 'complete',
    focus: 'Cardio',
    intensity: 'moderate',
  },
]

const createDefaultData = (user?: SessionUser): StoredUserData => ({
  profile: {
    id: user?.id ?? 'user-001',
    name: user?.name ?? 'New Athlete',
    email: user?.email,
    level: 3,
    xp: 750,
    nextLevelXp: 1000,
    currentGoal: 'Lean & Strong',
    totalWorkouts: 42,
    longestStreak: 14,
  },
  workouts: {
    total: 42,
    recommendedNext: {
      title: 'Power Circuit',
      focus: 'Full body strength & conditioning',
      duration: 28,
      intensity: 'moderate',
      equipment: ['dumbbells', 'mat'],
    },
    weekPlan: [
      { day: 'Mon', focus: 'Upper body push', status: 'complete' },
      { day: 'Tue', focus: 'Mobility & core', status: 'planned' },
      { day: 'Wed', focus: 'Lower body power', status: 'planned' },
      { day: 'Thu', focus: 'Active recovery', status: 'rest' },
      { day: 'Fri', focus: 'Posterior chain', status: 'planned' },
      { day: 'Sat', focus: 'Conditioning', status: 'planned' },
      { day: 'Sun', focus: 'Rest & reset', status: 'rest' },
    ],
    sessions: defaultSessions,
  },
  checkIns: createInitialCheckIns(),
  streak: {
    current: 7,
    longest: 14,
    lastCheckIn: formatIsoDate(new Date(Date.now() - MS_PER_DAY)),
  },
  focusAreas: [
    { title: 'Consistency first', description: 'Check in before noon for an easier streak boost.' },
    { title: 'Posterior chain', description: 'Lean goal benefits from hinge work twice per week.' },
    { title: 'Active recovery', description: 'Layer mobility on lighter days to reduce fatigue.' },
  ],
  onboarding: null,
  metrics: {
    height: 180,
    weight: 165,
    experience: 'intermediate',
    bodyStatus: 'Athletic',
  },
  preferences: {
    goalFocus: 'Lean & Strong',
    preferredSchedule: 4,
    preferredIntensity: 'moderate',
    preferredTime: 'morning',
  },
  progress: {
    readiness: 78,
    recovery: 72,
    trend: [65, 68, 70, 72, 74, 77, 78],
    milestones: [
      { label: 'Consistency', value: 83, delta: 5 },
      { label: 'Energy', value: 74, delta: 3 },
      { label: 'Recovery', value: 71, delta: 2 },
    ],
    lifts: [
      { id: 'squat', name: 'Front Squat', current: 225, previous: 205 },
      { id: 'deadlift', name: 'Trap Bar Deadlift', current: 275, previous: 255 },
      { id: 'bench', name: 'Bench Press', current: 185, previous: 175 },
    ],
    bodyComposition: [
      { label: 'Body Fat', value: 16.2, unit: '%' },
      { label: 'Lean Mass', value: 140, unit: 'lb' },
      { label: 'Hydration', value: 62, unit: '%' },
    ],
  },
})

const selectUserData = async (userId: string): Promise<StoredUserData | null> => {
  const res = await supabaseFetch(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(userId)}&select=data`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })
  const rows = (await res.json()) as { data: StoredUserData }[]
  return rows[0]?.data ?? null
}

const insertUserData = async (userId: string, data: StoredUserData) => {
  await supabaseFetch(SUPABASE_TABLE, {
    method: 'POST',
    body: JSON.stringify({ id: userId, data }),
  })
}

const updateUserData = async (userId: string, data: StoredUserData) => {
  await supabaseFetch(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ data }),
  })
}

const getUserData = async (userId: string, user?: SessionUser): Promise<StoredUserData> => {
  const existing = await selectUserData(userId)
  if (existing) {
    return existing
  }
  const defaults = createDefaultData(user)
  await insertUserData(userId, defaults)
  return defaults
}

const refreshCheckIns = (data: StoredUserData) => {
  data.checkIns = data.checkIns
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((entry, index, arr) => ({
      ...entry,
      label: formatWeekdayLabel(entry.date, index === arr.length - 1),
    }))
}

const differenceInDays = (currentIso: string, previousIso: string) => {
  const [cy, cm, cd] = currentIso.split('-').map(Number)
  const [py, pm, pd] = previousIso.split('-').map(Number)
  const current = Date.UTC(cy, cm - 1, cd)
  const previous = Date.UTC(py, pm - 1, pd)
  return Math.round((current - previous) / MS_PER_DAY)
}

const updateStreak = (data: StoredUserData, isoDate: string) => {
  if (!data.streak.lastCheckIn) {
    data.streak.current = 1
    data.streak.lastCheckIn = isoDate
    return
  }
  const difference = differenceInDays(isoDate, data.streak.lastCheckIn)
  if (difference === 0) return
  data.streak.current = difference === 1 ? data.streak.current + 1 : 1
  data.streak.lastCheckIn = isoDate
  data.streak.longest = Math.max(data.streak.longest, data.streak.current)
  data.profile.longestStreak = data.streak.longest
}

const buildDashboardResponse = (data: StoredUserData): DashboardResponse => {
  refreshCheckIns(data)
  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first workout',
      threshold: 1,
      type: 'workout',
      currentValue: data.workouts.total,
      progressPercent: Math.min(100, Math.round((data.workouts.total / 1) * 100)),
      unlocked: data.workouts.total >= 1,
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7 day streak',
      threshold: 7,
      type: 'streak',
      currentValue: data.streak.current,
      progressPercent: Math.min(100, Math.round((data.streak.current / 7) * 100)),
      unlocked: data.streak.current >= 7,
    },
    {
      id: 'two-weeks-strong',
      name: 'Two Weeks Strong',
      description: 'Hit a 14 day streak',
      threshold: 14,
      type: 'streak',
      currentValue: data.streak.current,
      progressPercent: Math.min(100, Math.round((data.streak.current / 14) * 100)),
      unlocked: data.streak.current >= 14,
    },
    {
      id: 'monthly-master',
      name: 'Monthly Master',
      description: 'Log activity on 30 different days',
      threshold: 30,
      type: 'workout',
      currentValue: data.workouts.total,
      progressPercent: Math.min(100, Math.round((data.workouts.total / 30) * 100)),
      unlocked: data.workouts.total >= 30,
    },
  ]

  return {
    profile: {
      name: data.profile.name,
      level: data.profile.level,
      xp: data.profile.xp,
      nextLevelXp: data.profile.nextLevelXp,
      currentGoal: data.profile.currentGoal,
      totalWorkouts: data.workouts.total,
    },
    streak: {
      current: data.streak.current,
      longest: data.streak.longest,
      hasCheckedInToday: data.checkIns.some((entry) => entry.date === formatIsoDate() && entry.completed),
      checkIns: data.checkIns,
    },
    workouts: {
      total: data.workouts.total,
      recommendedNext: data.workouts.recommendedNext,
      weekPlan: data.workouts.weekPlan,
    },
    achievements,
    focus: data.focusAreas,
  }
}

export const ensureUserRecord = async (user: SessionUser) => {
  await getUserData(user.id, user)
}

export const getDashboardSnapshot = async (userId: string) => {
  const data = await getUserData(userId)
  return buildDashboardResponse(data)
}

export const recordCheckIn = async (userId: string) => {
  const data = await getUserData(userId)
  const todayIso = formatIsoDate()
  const alreadyCheckedIn = data.checkIns.some((entry) => entry.date === todayIso && entry.completed)

  if (!alreadyCheckedIn) {
    data.workouts.total += 1
    data.profile.totalWorkouts = data.workouts.total
    updateStreak(data, todayIso)
    const existingIndex = data.checkIns.findIndex((entry) => entry.date === todayIso)
    if (existingIndex >= 0) {
      data.checkIns[existingIndex].completed = true
    } else {
      data.checkIns.push({ date: todayIso, label: 'Today', completed: true })
    }
    await updateUserData(userId, data)
  }

  return {
    alreadyCheckedIn,
    dashboard: buildDashboardResponse(data),
  }
}

export const saveOnboardingSubmission = async (userId: string, submission: OnboardingSubmission) => {
  const data = await getUserData(userId)
  data.onboarding = submission

  if (submission.personal?.name) {
    data.profile.name = submission.personal.name.split(' ')[0] || data.profile.name
  }

  if (submission.goals?.goalFocus) {
    data.profile.currentGoal = submission.goals.goalFocus
    data.preferences.goalFocus = submission.goals.goalFocus
  }

  if (submission.goals?.preferredSchedule) {
    data.preferences.preferredSchedule = submission.goals.preferredSchedule
    data.workouts.weekPlan = data.workouts.weekPlan.map((entry, index) => {
      if (entry.status === 'rest' && index <= submission.goals.preferredSchedule) {
        return {
          ...entry,
          status: 'planned',
          focus: entry.focus === 'Rest & reset' ? 'Mobility & breathwork' : entry.focus,
        }
      }
      return entry
    })
  }

  if (submission.goals?.preferredIntensity) {
    data.preferences.preferredIntensity = submission.goals.preferredIntensity
    data.workouts.recommendedNext.intensity = submission.goals.preferredIntensity
  }

  if (submission.metrics) {
    data.metrics.height = submission.metrics.height
    data.metrics.weight = submission.metrics.weight
    data.metrics.experience = submission.metrics.experience
  }

  await updateUserData(userId, data)
  return buildDashboardResponse(data)
}

export const getProfileSummary = async (userId: string) => {
  const data = await getUserData(userId)
  return {
    ...data.profile,
    totalWorkouts: data.workouts.total,
    onboarding: data.onboarding,
  }
}

export const getWorkoutsOverview = async (userId: string): Promise<WorkoutsResponse> => {
  const data = await getUserData(userId)
  const minutesThisWeek = data.workouts.sessions.filter((session) => session.status === 'complete').reduce((sum, session) => sum + session.duration, 0)
  const completedThisWeek = data.workouts.sessions.filter((session) => session.status === 'complete').length

  return {
    recommendedNext: data.workouts.recommendedNext,
    weekPlan: data.workouts.weekPlan,
    sessions: data.workouts.sessions,
    stats: {
      completedThisWeek,
      minutesThisWeek,
      consistency: Math.min(100, Math.round((completedThisWeek / Math.max(data.preferences.preferredSchedule, 1)) * 100)),
    },
  }
}

export const getProgressOverview = async (userId: string): Promise<ProgressResponse> => {
  const data = await getUserData(userId)
  return data.progress
}

export const getProfileDetails = async (userId: string): Promise<ProfileDetails> => {
  const data = await getUserData(userId)
  return {
    personal: {
      name: data.profile.name,
      email: data.profile.email ?? '',
      age: data.onboarding?.personal.age ?? 28,
      gender: data.onboarding?.personal.gender ?? 'Female',
    },
    metrics: {
      height: data.metrics.height,
      weight: data.metrics.weight,
      bodyStatus: data.metrics.bodyStatus,
    },
    preferences: {
      goalFocus: data.preferences.goalFocus,
      preferredSchedule: data.preferences.preferredSchedule,
      preferredTime: data.preferences.preferredTime,
      preferredIntensity: data.preferences.preferredIntensity,
    },
  }
}

export const updateProfileDetails = async (userId: string, updates: Partial<ProfileDetails>) => {
  const data = await getUserData(userId)

  if (updates.personal) {
    data.profile.name = updates.personal.name ?? data.profile.name
    data.profile.email = updates.personal.email ?? data.profile.email
    data.onboarding = data.onboarding ?? {
      personal: {
        name: data.profile.name,
        age: updates.personal.age ?? 28,
        gender: updates.personal.gender ?? 'Female',
      },
      metrics: {
        height: data.metrics.height,
        weight: data.metrics.weight,
        experience: data.metrics.experience,
      },
      goals: {
        goalFocus: data.preferences.goalFocus,
        preferredSchedule: data.preferences.preferredSchedule,
        preferredIntensity: data.preferences.preferredIntensity,
      },
    }
    data.onboarding.personal = {
      ...data.onboarding.personal,
      ...updates.personal,
    }
  }

  if (updates.metrics) {
    data.metrics = { ...data.metrics, ...updates.metrics }
  }

  if (updates.preferences) {
    data.preferences = { ...data.preferences, ...updates.preferences }
    data.profile.currentGoal = updates.preferences.goalFocus ?? data.profile.currentGoal
  }

  await updateUserData(userId, data)
  return getProfileDetails(userId)
}
