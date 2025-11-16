'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchProfileDetails, updateProfile } from '@/lib/api'
import type { ProfileDetails } from '@/types/profile'

export const useProfileData = () => {
  const [data, setData] = useState<ProfileDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchProfileDetails()
      setData(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(
    async (updates: Partial<ProfileDetails>) => {
      if (saving) return
      try {
        setSaving(true)
        setError(null)
        setSuccess(null)
        const response = await updateProfile(updates)
        setData(response.profile)
        setSuccess('Profile updated')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
      } finally {
        setSaving(false)
      }
    },
    [saving],
  )

  return { data, loading, error, saving, success, refresh: load, save }
}
