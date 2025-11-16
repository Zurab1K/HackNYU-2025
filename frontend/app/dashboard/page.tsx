'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Flame, Trophy, Calendar, Dumbbell, Target, CheckCircle2, RefreshCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useDashboardData } from '@/hooks/useDashboardData'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/navigation/bottom-nav'

const PLAN_STATUS_STYLES: Record<'planned' | 'complete' | 'rest', string> = {
  complete: 'text-primary bg-primary/10 border-primary/30',
  planned: 'text-foreground bg-secondary/40 border-border',
  rest: 'text-muted-foreground bg-transparent border-dashed border-border',
}

export default function Dashboard() {
  const router = useRouter()
  const { data, loading, error, refresh, checkIn, checkingIn } = useDashboardData()

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center space-y-4">
          {error ? (
            <>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={refresh} className="mx-auto">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
            </>
          )}
        </Card>
      </div>
    )
  }

  const { profile, streak, workouts, achievements, focus } = data
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100))

  const handleCheckIn = async () => {
    try {
      await checkIn()
    } catch {
      /* errors are surfaced via state */
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-white/10 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Welcome back</p>
            <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">{profile.currentGoal}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current streak</p>
            <div className="text-3xl font-bold text-primary">{streak.current} days</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 border border-white/10 shadow-lg md:col-span-2 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {streak.hasCheckedInToday ? 'Checked in today' : 'Ready for today?'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {streak.hasCheckedInToday
                    ? `Great work! Keep the ${streak.current}-day streak rolling.`
                    : `Tap in to protect your ${streak.current}-day streak.`}
                </p>
              </div>
              <div
                className={cn(
                  'p-3 rounded-full',
                  streak.hasCheckedInToday ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground animate-subtle-pulse',
                )}
              >
                <Flame className="h-6 w-6" />
              </div>
            </div>

            <Button
              className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60"
              disabled={streak.hasCheckedInToday || checkingIn}
              onClick={handleCheckIn}
            >
              {checkingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging check-in…
                </>
              ) : streak.hasCheckedInToday ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Checked in
                </>
              ) : (
                'Check in'
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {streak.checkIns.map((entry) => (
                <div key={entry.date} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] uppercase tracking-wide">{entry.label}</span>
                  <span
                    className={cn(
                      'h-3.5 w-3.5 rounded-full border',
                      entry.completed ? 'bg-primary border-primary/60' : 'border-border',
                    )}
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">
                {error} •{' '}
                <button onClick={refresh} className="underline">
                  Retry
                </button>
              </p>
            )}
          </Card>

          <Card className="p-6 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Level {profile.level}</h3>
              <span className="text-sm text-muted-foreground">
                {profile.xp} / {profile.nextLevelXp} XP
              </span>
            </div>
            <Progress value={xpPercent} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {profile.nextLevelXp - profile.xp} XP until Level {profile.level + 1}
            </p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<Calendar className="h-5 w-5 mx-auto text-primary" />} label="Current" value={`${streak.current} days`} />
          <StatCard icon={<Trophy className="h-5 w-5 mx-auto text-primary" />} label="Best" value={`${streak.longest} days`} />
          <StatCard icon={<Dumbbell className="h-5 w-5 mx-auto text-primary" />} label="Workouts" value={profile.totalWorkouts.toString()} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {focus.map((insight) => (
            <Card key={insight.title} className="p-5 border border-white/10 bg-card/70 shadow-lg">
              <p className="text-sm font-semibold text-foreground">{insight.title}</p>
              <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>
            </Card>
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Achievements</h3>
            <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  'p-4 border shadow-sm transition-colors',
                  achievement.unlocked ? 'border-primary/30 bg-primary/5' : 'border-border',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', achievement.unlocked ? 'bg-primary/20' : 'bg-secondary')}>
                    {achievement.unlocked ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground">{achievement.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {achievement.currentValue}/{achievement.threshold}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {!achievement.unlocked && <Progress value={achievement.progressPercent} className="h-1.5" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-foreground">Week snapshot</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {workouts.weekPlan.map((day) => (
              <Card key={day.day} className={cn('p-4 border text-sm', PLAN_STATUS_STYLES[day.status])}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{day.day}</span>
                  <span className="text-xs capitalize">{day.status}</span>
                </div>
                <p className="text-xs mt-2">{day.focus}</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/workouts')}>
            <Dumbbell className="h-6 w-6" />
            <span className="text-sm font-medium">Start Workout</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/progress')}>
            <Clock className="h-6 w-6" />
            <span className="text-sm font-medium">View Progress</span>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="space-y-2">
    {icon}
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold text-foreground">{value}</div>
  </div>
)
