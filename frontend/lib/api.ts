import type { DashboardResponse } from '@/types/dashboard'
import type { WorkoutsResponse } from '@/types/workouts'
import type { ProgressResponse } from '@/types/progress'
import type { ProfileDetails } from '@/types/profile'
import {
  checkInToday,
  getDashboardData,
  getProgressData,
  getProfileDetails,
  getWorkoutsData,
  updateProfileDetails,
} from '@/lib/training-state'

export const fetchDashboard = async (): Promise<DashboardResponse> => getDashboardData()

export const postCheckIn = async () => ({
  message: 'Check-in saved',
  dashboard: checkInToday(),
})

export const fetchWorkouts = async (): Promise<WorkoutsResponse> => getWorkoutsData()

export const fetchProgress = async (): Promise<ProgressResponse> => getProgressData()

export const fetchProfileDetails = async (): Promise<ProfileDetails> => getProfileDetails()

export const updateProfile = async (profile: Partial<ProfileDetails>) => {
  const current = getProfileDetails()
  const merged: ProfileDetails = {
    personal: { ...current.personal, ...profile.personal },
    metrics: { ...current.metrics, ...profile.metrics },
    preferences: { ...current.preferences, ...profile.preferences },
  }
  return {
    message: 'Profile updated',
    profile: updateProfileDetails(merged),
  }
}
