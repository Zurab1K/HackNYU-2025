'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchDashboard, postCheckIn } from '@/lib/api'
import type { DashboardResponse } from '@/types/dashboard'

type DashboardState = {
  data: DashboardResponse | null
  loading: boolean
  error: string | null
  checkingIn: boolean
}

const INITIAL_STATE: DashboardState = {
  data: null,
  loading: true,
  error: null,
  checkingIn: false,
}

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE)

  const loadDashboard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const dashboard = await fetchDashboard()
      setState({ data: dashboard, loading: false, error: null, checkingIn: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const checkIn = useCallback(async () => {
    if (state.checkingIn) return
    setState((prev) => ({ ...prev, checkingIn: true, error: null }))
    try {
      const response = await postCheckIn()
      setState((prev) => ({
        ...prev,
        data: response.dashboard,
        checkingIn: false,
      }))
      return response.message
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to record check-in'
      setState((prev) => ({ ...prev, checkingIn: false, error: message }))
      throw new Error(message)
    }
  }, [state.checkingIn])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    checkingIn: state.checkingIn,
    refresh: loadDashboard,
    checkIn,
  }
}
