'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchProgress } from '@/lib/api'
import { subscribeTrainingStateUpdates } from '@/lib/training-events'
import type { ProgressResponse } from '@/types/progress'

export const useProgressData = () => {
  const [data, setData] = useState<ProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchProgress()
      setData(response)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load progress'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const unsubscribe = subscribeTrainingStateUpdates(load)
    return unsubscribe
  }, [load])

  return { data, loading, error, refresh: load }
}
