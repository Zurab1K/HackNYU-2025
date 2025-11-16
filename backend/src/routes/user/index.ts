import { Router, type Request, type Response } from 'express'
import {
  getDashboardSnapshot,
  getProfileDetails,
  getProfileSummary,
  getProgressOverview,
  getWorkoutsOverview,
  recordCheckIn,
  saveOnboardingSubmission,
  updateProfileDetails,
} from '../../data/userStore'
import { OnboardingSubmission, ProfileDetails } from '../../types/api'
import type { SessionUser } from '../../auth/passport'

const router = Router()

const requireUser = (req: Request, res: Response): SessionUser | null => {
  const user = req.user as SessionUser | undefined
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return null
  }
  return user
}

router.get('/', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const summary = await getProfileSummary(user.id)
  res.json(summary)
})

router.get('/dashboard', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const dashboard = await getDashboardSnapshot(user.id)
  res.json(dashboard)
})

router.get('/workouts', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const workouts = await getWorkoutsOverview(user.id)
  res.json(workouts)
})

router.get('/progress', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const progress = await getProgressOverview(user.id)
  res.json(progress)
})

router.get('/profile', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const profile = await getProfileDetails(user.id)
  res.json(profile)
})

router.post('/check-ins', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const result = await recordCheckIn(user.id)

  if (result.alreadyCheckedIn) {
    return res.status(200).json({
      message: 'Already checked in today',
      dashboard: result.dashboard,
    })
  }

  return res.status(201).json({
    message: 'Check-in recorded',
    dashboard: result.dashboard,
  })
})

router.post('/onboarding', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return

  const submission = req.body as Partial<OnboardingSubmission>

  if (
    !submission?.personal?.name ||
    !submission.personal.age ||
    !submission.personal.gender ||
    !submission.metrics?.height ||
    !submission.metrics.weight ||
    !submission.metrics.experience ||
    !submission.goals?.goalFocus ||
    !submission.goals.preferredIntensity ||
    !submission.goals.preferredSchedule
  ) {
    return res.status(400).json({
      message: 'Missing onboarding fields',
    })
  }

  const payload: OnboardingSubmission = {
    personal: {
      name: submission.personal.name.trim(),
      age: Number(submission.personal.age),
      gender: submission.personal.gender,
    },
    metrics: {
      height: Number(submission.metrics.height),
      weight: Number(submission.metrics.weight),
      experience: submission.metrics.experience,
    },
    goals: {
      goalFocus: submission.goals.goalFocus,
      preferredIntensity: submission.goals.preferredIntensity,
      preferredSchedule: Number(submission.goals.preferredSchedule),
    },
  }

  const dashboard = await saveOnboardingSubmission(user.id, payload)

  return res.status(201).json({
    message: 'Onboarding saved',
    dashboard,
  })
})

router.patch('/profile', async (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const updates = req.body as Partial<ProfileDetails>
  const profile = await updateProfileDetails(user.id, updates)

  res.json({
    message: 'Profile updated',
    profile,
  })
})

export default router
