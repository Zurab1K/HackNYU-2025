'use client'

import { useRouter } from 'next/navigation'
import { Flame, Clock, CheckCircle2, RefreshCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWorkoutsData } from '@/hooks/useWorkoutsData'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { AssistantChat } from '@/components/assistant/assistant-chat'

const INTENSITY_COLORS: Record<string, string> = {
  low: 'text-emerald-300',
  moderate: 'text-primary',
  high: 'text-orange-300',
}

export default function WorkoutsPage() {
  const router = useRouter()
  const { data, loading, error, refresh } = useWorkoutsData()

  const openAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-assistant'))
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

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Week plan</h3>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sync
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {data.weekPlan.map((entry) => (
              <Card
                key={entry.day}
                className={cn(
                  'p-4 border text-sm transition-colors',
                  entry.status === 'complete' ? 'border-primary/40 bg-primary/5' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{entry.day}</span>
                  <span className="text-xs capitalize">{entry.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{entry.focus}</p>
              </Card>
            ))}
          </div>
        </section>

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
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-white/10 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Workouts</h1>
          <p className="text-sm text-muted-foreground">Stay on pace with your training blocks</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">{renderBody()}</main>

      <BottomNav />
      <AssistantChat />
    </div>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <span>{label}</span>
    <span className="text-foreground font-semibold">{value}</span>
  </div>
)
