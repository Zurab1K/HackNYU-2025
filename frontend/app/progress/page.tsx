'use client'

import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProgressData } from '@/hooks/useProgressData'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { cn } from '@/lib/utils'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Input } from '@/components/ui/input'
import { logProgressMetrics } from '@/lib/training-state'

export default function ProgressPage() {
  const { data, loading, error, refresh } = useProgressData()
  const [readinessInput, setReadinessInput] = useState('')
  const [weightInput, setWeightInput] = useState('')
  const [selectedLiftId, setSelectedLiftId] = useState('')
  const [liftValue, setLiftValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogProgress = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!data) return
    setSaving(true)
    setMessage(null)
    setErrorMessage(null)
    try {
      const payload: { readiness?: number; weight?: number; liftId?: string; liftValue?: number } = {}
      if (readinessInput) payload.readiness = Number(readinessInput)
      if (weightInput) payload.weight = Number(weightInput)
      if (selectedLiftId && liftValue) {
        payload.liftId = selectedLiftId
        payload.liftValue = Number(liftValue)
      }
      if (!Object.keys(payload).length) {
        setErrorMessage('Enter at least one value to log progress.')
        setSaving(false)
        return
      }
      await logProgressMetrics(payload)
      setMessage('Progress updated')
      setReadinessInput('')
      setWeightInput('')
      setSelectedLiftId('')
      setLiftValue('')
      refresh()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to update progress')
    } finally {
      setSaving(false)
    }
  }

  const renderSparkline = (values: number[]) => {
    const max = Math.max(...values, 1)
    return (
      <div className="flex items-end gap-1 h-16">
        {values.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="w-2 rounded-full bg-primary/70"
            style={{ height: `${(value / max) * 100}%` }}
          />
        ))}
      </div>
    )
  }

  const body = () => {
    if (loading) {
      return (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading progress…</p>
        </Card>
      )
    }

    if (error || !data) {
      return (
        <Card className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{error ?? 'Unable to load progress'}</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Card>
      )
    }

    return (
      <>
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Log new metrics</h3>
            {message && <span className="text-xs text-emerald-500">{message}</span>}
            {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
          </div>
          <form onSubmit={handleLogProgress} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="readiness">
                Readiness (1-100)
              </label>
              <Input
                id="readiness"
                type="number"
                min={1}
                max={100}
                value={readinessInput}
                onChange={(event) => setReadinessInput(event.target.value)}
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="weight">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                min={1}
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="lift">
                Update lift
              </label>
              <select
                id="lift"
                value={selectedLiftId}
                onChange={(event) => setSelectedLiftId(event.target.value)}
                className="h-12 w-full rounded-2xl border border-border/60 bg-white/80 px-4 text-sm text-foreground"
              >
                <option value="">Select a lift</option>
                {data.lifts.map((lift) => (
                  <option value={lift.id} key={lift.id}>
                    {lift.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="lift-value">
                New lift value (lb)
              </label>
              <Input
                id="lift-value"
                type="number"
                min={0}
                value={liftValue}
                onChange={(event) => setLiftValue(event.target.value)}
                placeholder="160"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Log metrics'}
              </Button>
            </div>
          </form>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Readiness</p>
                <p className="text-3xl font-semibold text-foreground">{data.readiness}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recovery</p>
                <p className="text-3xl font-semibold text-primary">{data.recovery}%</p>
              </div>
            </div>
            {renderSparkline(data.trend)}
            <p className="text-xs text-muted-foreground">Trend over the past week</p>
          </Card>

          <Card className="space-y-4 p-6">
            <h3 className="text-lg font-semibold text-foreground">Milestones</h3>
            <div className="space-y-4">
              {data.milestones.map((milestone) => (
                <div key={milestone.label}>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{milestone.label}</p>
                      <p className="text-xs text-muted-foreground">Change vs last week</p>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        milestone.delta >= 0 ? 'text-emerald-300' : 'text-rose-300',
                      )}
                    >
                      {milestone.delta >= 0 ? '+' : ''}
                      {milestone.delta}
                    </span>
                  </div>
                  <Progress value={milestone.value} className="h-2 mt-3" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-4 p-6">
            <h3 className="text-lg font-semibold text-foreground">Strength progression</h3>
            <div className="space-y-3">
              {data.lifts.map((lift) => (
                <div key={lift.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{lift.name}</p>
                    <p className="text-xs text-muted-foreground">Prev {lift.previous} lb</p>
                  </div>
                  <span className="text-primary font-semibold">{lift.current} lb</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h3 className="text-lg font-semibold text-foreground">Body composition</h3>
            <div className="space-y-3">
              {data.bodyComposition.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{entry.label}</span>
                  <span className="text-foreground font-semibold">
                    {entry.value} {entry.unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </>
    )
  }

  return (
    <AmbientBackground className="pb-24">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Performance</p>
          <h1 className="text-4xl font-semibold text-foreground">Progress</h1>
          <p className="text-base text-muted-foreground">Readiness, milestones, and composition snapshots.</p>
        </div>

        {body()}
      </div>

      <BottomNav />
    </AmbientBackground>
  )
}
