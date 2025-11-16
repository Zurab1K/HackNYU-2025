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
import { AmbientBackground } from '@/components/layout/ambient-background'
import { WeekGlance } from '@/components/calendar/week-glance'

export default function Dashboard() {
  const router = useRouter()
  const { data, error, refresh, checkIn, checkingIn } = useDashboardData()

  if (!data) {
    return (
      <AmbientBackground className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md space-y-4 p-10 text-center">
          {error ? (
            <>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={refresh} className="mx-auto rounded-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Curating your dashboard…</p>
            </>
          )}
        </Card>
      </AmbientBackground>
    )
  }

  const { profile, streak, workouts, achievements, focus } = data
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100))

  const handleCheckIn = async () => {
    try {
      await checkIn()
    } catch {
      /* handled by hook */
    }
  }

  return (
    <AmbientBackground className="pb-24">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Welcome back</p>
            <h1 className="text-4xl font-semibold text-foreground">{profile.name}</h1>
            <p className="text-base text-muted-foreground">Currently dialed into {profile.currentGoal}</p>
          </div>
          <div className="rounded-full border border-border/70 bg-white/70 px-5 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            Streak • <span className="font-semibold text-foreground">{streak.current} days</span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-8 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today’s ritual</p>
                <h2 className="text-3xl font-semibold text-foreground">
                  {streak.hasCheckedInToday ? 'Already grounded' : 'Log your presence'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {streak.hasCheckedInToday
                    ? `Protected streak: ${streak.current} days`
                    : `Keep the ${streak.current}-day streak alive.`}
                </p>
              </div>
              <div
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-inner',
                  streak.hasCheckedInToday
                    ? 'bg-primary/10 text-primary'
                    : 'animate-subtle-pulse bg-secondary text-secondary-foreground',
                )}
              >
                <Flame className="h-4 w-4" />
                Momentum
              </div>
            </div>

            <Button
              className="h-12 w-full rounded-full text-base font-semibold"
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
                  Logged today
                </>
              ) : (
                'Check in'
              )}
            </Button>

            <div className="grid gap-4 sm:grid-cols-3">
              <OverviewStat label="Longest streak" value={`${streak.longest} days`} icon={<Calendar className="h-4 w-4" />} />
              <OverviewStat label="Total workouts" value={profile.totalWorkouts.toString()} icon={<Dumbbell className="h-4 w-4" />} />
              <OverviewStat label="Level" value={`LVL ${profile.level}`} icon={<Trophy className="h-4 w-4" />} />
            </div>

            <div className="rounded-2xl border border-border/70 bg-white/70 p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {streak.checkIns.map((entry) => (
                  <div key={entry.date} className="flex flex-col items-center gap-2">
                    <span className="uppercase tracking-wide">{entry.label}</span>
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border border-border/80',
                        entry.completed ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {entry.completed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-8 p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Level {profile.level}</p>
                  <h3 className="text-2xl font-semibold text-foreground">{profile.currentGoal}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">XP to level up</p>
                  <p className="text-lg font-semibold text-foreground">{profile.nextLevelXp - profile.xp} XP</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{profile.xp} XP earned</span>
                  <span>{profile.nextLevelXp} needed</span>
                </div>
                <Progress value={xpPercent} className="h-2 rounded-full" />
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white/80 p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Next session</p>
              <h4 className="mt-2 text-xl font-semibold text-foreground">{workouts.recommendedNext.title}</h4>
              <p className="text-sm text-muted-foreground">{workouts.recommendedNext.focus}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {workouts.recommendedNext.duration} min
                </span>
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Precision block
                </span>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-8">
            <WeekGlance plan={workouts.weekPlan} disabled />
          </Card>

          <Card className="space-y-5 p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Milestones</h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => router.push('/progress')}
              >
                View roadmap
              </Button>
            </div>
            <div className="space-y-4">
              {achievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="rounded-2xl border border-border/60 bg-white/80 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {achievement.currentValue}/{achievement.threshold}
                    </span>
                  </div>
                  <Progress value={achievement.progressPercent} className="mt-3 h-2 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card className="space-y-5 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Coach insights</p>
              <h3 className="text-xl font-semibold text-foreground">What your program emphasizes</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => refresh()} className="rounded-full">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {focus.map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-border/60 bg-white/70 p-4 shadow-inner">
                <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <BottomNav />
    </AmbientBackground>
  )
}

type OverviewStatProps = {
  icon: ReactNode
  label: string
  value: string
}

function OverviewStat({ icon, label, value }: OverviewStatProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-white/80 p-4 text-sm text-muted-foreground shadow-inner">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
