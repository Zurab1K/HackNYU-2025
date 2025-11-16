'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Clock, CheckCircle2, RefreshCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWorkoutsData } from '@/hooks/useWorkoutsData'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { logWorkoutSession } from '@/lib/training-state'
import { Fireworks } from '@/components/celebration/fireworks'
import { WeekGlance } from '@/components/calendar/week-glance'
import type { WeekPlanEntry } from '@/types/workouts'

const INTENSITY_COLORS: Record<string, string> = {
  low: 'text-emerald-300',
  moderate: 'text-primary',
  high: 'text-orange-300',
}

export default function WorkoutsPage() {
  const router = useRouter()
  const { data, loading, error, refresh } = useWorkoutsData()
  const [logForm, setLogForm] = useState({
    title: '',
    duration: 20,
    focus: '',
    intensity: 'moderate' as 'low' | 'moderate' | 'high',
  })
  const [logging, setLogging] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [localPlan, setLocalPlan] = useState<WeekPlanEntry[]>([])
  const [impact, setImpact] = useState<{
    xpEarned: number
    level: number
    streak: number
    totalXp: number
    title: string
  } | null>(null)

  useEffect(() => {
    if (data?.recommendedNext) {
      setLogForm((prev) => ({
        ...prev,
        title: data.recommendedNext.title,
        focus: data.recommendedNext.focus,
        duration: data.recommendedNext.duration,
        intensity: data.recommendedNext.intensity ?? prev.intensity,
      }))
    }
  }, [data])

  useEffect(() => {
    if (data?.weekPlan) {
      setLocalPlan(data.weekPlan)
    }
  }, [data?.weekPlan])

  const openAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-assistant'))
    }
  }

  const handleLogWorkout = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!logForm.title.trim()) return
    setLogging(true)
    try {
      const result = await logWorkoutSession(logForm)
      setImpact({
        xpEarned: result.xpEarned,
        level: result.level,
        streak: result.streak,
        totalXp: result.totalXp,
        title: logForm.title,
      })
      setShowFireworks(true)
      setTimeout(() => setShowFireworks(false), 1500)
      refresh()
    } finally {
      setLogging(false)
    }
  }

  const renderBody = () => {
    if (loading) {
      return (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading workouts...</p>
        </Card>
      )
    }

    if (error || !data) {
      return (
        <Card className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{error ?? 'Unable to load workouts'}</p>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Card>
      )
    }

    return (
      <>
        {impact && (
          <Card className="border border-primary/50 bg-primary/5 p-5 text-sm text-foreground">
            <p className="font-semibold text-base text-primary">+{impact.xpEarned} XP</p>
            <p className="text-sm mt-1">{impact.title} logged • Level {impact.level} • Streak {impact.streak} days</p>
          </Card>
        )}
        <Card className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Log a session</p>
              <h2 className="text-xl font-semibold text-foreground">Turn effort into streak fuel</h2>
            </div>
            <p className="text-sm text-muted-foreground">Earn XP for every intentional minute.</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogWorkout}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Session title</Label>
                <Input
                  value={logForm.title}
                  onChange={(event) => setLogForm({ ...logForm, title: event.target.value })}
                  placeholder="Strength flow"
                  className="rounded-2xl border border-border/70 bg-white/80 px-4"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Minutes</Label>
                <Input
                  type="number"
                  min={5}
                  value={logForm.duration}
                  onChange={(event) => setLogForm({ ...logForm, duration: Number(event.target.value) })}
                  className="rounded-2xl border border-border/70 bg-white/80 px-4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Focus</Label>
              <Input
                value={logForm.focus}
                onChange={(event) => setLogForm({ ...logForm, focus: event.target.value })}
                placeholder="Tempo lower body"
                className="rounded-2xl border border-border/70 bg-white/80 px-4"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Intensity</Label>
              <div className="flex flex-wrap gap-3">
                {(['low', 'moderate', 'high'] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setLogForm({ ...logForm, intensity: value })}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-semibold transition',
                      logForm.intensity === value
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'border border-border/70 bg-white/70 text-foreground hover:border-primary/40',
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-full" disabled={logging}>
              {logging ? 'Logging session…' : 'Add to streak'}
            </Button>
          </form>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 space-y-3 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground">Next up</p>
            <h2 className="text-2xl font-bold text-foreground">{data.recommendedNext.title}</h2>
            <p className="text-sm text-muted-foreground">{data.recommendedNext.focus}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {data.recommendedNext.duration} min
              </span>
              {data.recommendedNext.intensity && (
                <span className={cn('capitalize font-medium', INTENSITY_COLORS[data.recommendedNext.intensity] ?? '')}>
                  {data.recommendedNext.intensity} intensity
                </span>
              )}
            </div>
            {data.recommendedNext.equipment && (
              <p className="text-xs text-muted-foreground">
                Equipment: {data.recommendedNext.equipment.join(', ')}
              </p>
            )}
            <Button className="w-full h-10" onClick={openAssistant}>
              Start Warm-up
            </Button>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly summary</h3>
            <div className="space-y-3">
              <SummaryRow label="Completed sessions" value={`${data.stats.completedThisWeek} / ${data.weekPlan.length}`} />
              <SummaryRow label="Minutes logged" value={`${data.stats.minutesThisWeek} min`} />
              <SummaryRow label="Consistency" value={`${data.stats.consistency}%`} />
            </div>
          </Card>
        </section>

        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Calendar</p>
              <h3 className="text-lg font-semibold text-foreground">Plan for the week</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <WeekGlance
            plan={localPlan.length ? localPlan : data.weekPlan}
            onUpdate={(next) => setLocalPlan(next)}
          />
        </Card>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Recent sessions</h3>
          <div className="space-y-3">
            {data.sessions.map((session) => (
              <Card key={session.id} className="p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.date} • {session.focus}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium capitalize',
                      INTENSITY_COLORS[session.intensity] ?? 'text-muted-foreground',
                    )}
                  >
                    {session.intensity}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {session.duration} min
                  </span>
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    {session.calories} kcal
                  </span>
                  {session.status === 'complete' ? (
                    <span className="flex items-center gap-1 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </span>
                  ) : (
                    <span className="text-amber-200">Planned</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </>
    )
  }

  return (
    <AmbientBackground className="pb-24">
      <Fireworks show={showFireworks} />
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Sessions</p>
          <h1 className="text-4xl font-semibold text-foreground">Workouts</h1>
          <p className="text-base text-muted-foreground">Stay on pace with the block and adapt in one tap.</p>
        </div>

        {renderBody()}
      </div>

      <BottomNav />
    </AmbientBackground>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <span>{label}</span>
    <span className="text-foreground font-semibold">{value}</span>
  </div>
)
