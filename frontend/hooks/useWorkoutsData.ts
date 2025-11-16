'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchWorkouts } from '@/lib/api'
import type { WorkoutsResponse } from '@/types/workouts'

export const useWorkoutsData = () => {
  const [data, setData] = useState<WorkoutsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchWorkouts()
      setData(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load workouts'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: load }
}
