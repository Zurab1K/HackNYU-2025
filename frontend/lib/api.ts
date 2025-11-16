import type { DashboardResponse } from '@/types/dashboard'
import type { OnboardingPayload } from '@/types/onboarding'
import type { WorkoutsResponse } from '@/types/workouts'
import type { ProgressResponse } from '@/types/progress'
import type { ProfileDetails } from '@/types/profile'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
}

const request = async <T>(path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Unexpected API error')
  }

  return (await response.json()) as T
}

export const fetchDashboard = () => request<DashboardResponse>('/users/dashboard')

export const postCheckIn = () =>
  request<{ message: string; dashboard: DashboardResponse }>('/users/check-ins', { method: 'POST' })

export const submitOnboarding = (payload: OnboardingPayload) =>
  request<{ message: string; dashboard: DashboardResponse }>('/users/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchWorkouts = () => request<WorkoutsResponse>('/users/workouts')

export const fetchProgress = () => request<ProgressResponse>('/users/progress')

export const fetchProfileDetails = () => request<ProfileDetails>('/users/profile')

export const updateProfile = (profile: Partial<ProfileDetails>) =>
  request<{ message: string; profile: ProfileDetails }>('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  })
