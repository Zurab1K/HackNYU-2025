'use client'

import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProgressData } from '@/hooks/useProgressData'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { cn } from '@/lib/utils'

export default function ProgressPage() {
  const { data, loading, error, refresh } = useProgressData()

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
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 border border-white/5 shadow-lg space-y-4">
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

          <Card className="p-6 border border-white/5 shadow-lg space-y-4">
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
          <Card className="p-6 border border-white/5 shadow-lg space-y-4">
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

          <Card className="p-6 border border-white/5 shadow-lg space-y-4">
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
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-white/10 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Progress</h1>
          <p className="text-sm text-muted-foreground">Track readiness, milestones, and body composition</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">{body()}</main>

      <BottomNav />
    </div>
  )
}
