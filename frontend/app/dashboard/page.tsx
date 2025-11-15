'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Flame, Trophy, Calendar, Dumbbell, Target, CheckCircle2, Home, User, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [totalWorkouts, setTotalWorkouts] = useState(42)

  const userStats = {
    name: "Alex",
    level: 3,
    xp: 750,
    nextLevelXp: 1000,
    longestStreak: 14,
    totalWorkouts: totalWorkouts,
    currentGoal: "Lean & Strong"
  }

  const perks = [
    { id: 1, name: "First Steps", unlocked: true, threshold: 1, description: "Complete your first workout", progress: 100 },
    { id: 2, name: "Week Warrior", unlocked: true, threshold: 7, description: "7 day streak", progress: 100 },
    { id: 3, name: "Two Weeks Strong", unlocked: false, threshold: 14, description: "14 day streak", progress: 50 },
    { id: 4, name: "Monthly Master", unlocked: false, threshold: 30, description: "30 day streak", progress: 23 },
  ]

  const handleCheckIn = () => {
    if (!hasCheckedInToday) {
      setCurrentStreak(currentStreak + 1)
      setTotalWorkouts(totalWorkouts + 1)
      setHasCheckedInToday(true)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Simple Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hi, {userStats.name}</h1>
              <p className="text-sm text-muted-foreground">{userStats.currentGoal}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{currentStreak}</div>
                <div className="text-xs text-muted-foreground">day streak</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Check-in Card */}
        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1 text-foreground">
                  {hasCheckedInToday ? 'Checked in today' : 'Ready for today?'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {hasCheckedInToday 
                    ? `Great work! Keep your ${currentStreak} day streak going.`
                    : `Check in to maintain your ${currentStreak} day streak.`
                  }
                </p>
              </div>
              <div className={`p-3 rounded-full ${hasCheckedInToday ? 'bg-primary/10' : 'bg-secondary'} ${!hasCheckedInToday ? 'animate-subtle-pulse' : ''}`}>
                <Flame className={`h-6 w-6 ${hasCheckedInToday ? 'text-primary' : 'text-secondary-foreground'}`} />
              </div>
            </div>
            
            <Button 
              className="w-full h-11 bg-primary hover:bg-primary/90"
              onClick={handleCheckIn}
              disabled={hasCheckedInToday}
            >
              {hasCheckedInToday ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Checked In
                </>
              ) : (
                <>
                  Check In
                </>
              )}
            </Button>

            {!hasCheckedInToday && (
              <p className="text-xs text-center text-muted-foreground">
                Earn 25 XP for checking in
              </p>
            )}
          </div>
        </Card>

        {/* Progress Card */}
        <Card className="p-6 border border-border shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Level {userStats.level}</h3>
              <span className="text-sm text-muted-foreground">{userStats.xp} / {userStats.nextLevelXp} XP</span>
            </div>
            <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {userStats.nextLevelXp - userStats.xp} XP until Level {userStats.level + 1}
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 border border-border shadow-sm text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </Card>

          <Card className="p-4 border border-border shadow-sm text-center">
            <Trophy className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{userStats.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </Card>

          <Card className="p-4 border border-border shadow-sm text-center">
            <Dumbbell className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Workouts</div>
          </Card>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Achievements</h3>
          <div className="space-y-3">
            {perks.map((perk) => (
              <Card 
                key={perk.id}
                className={`p-4 border shadow-sm ${
                  perk.unlocked 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    perk.unlocked ? 'bg-primary/20' : 'bg-secondary'
                  }`}>
                    {perk.unlocked ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-foreground">{perk.name}</h4>
                      {perk.unlocked && (
                        <span className="text-xs text-primary">Unlocked</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{perk.description}</p>
                    {!perk.unlocked && (
                      <>
                        <Progress value={perk.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round((perk.progress / 100) * perk.threshold)}/{perk.threshold} days
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Dumbbell className="h-6 w-6" />
            <span className="text-sm font-medium">Start Workout</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm font-medium">View Progress</span>
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-primary">
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground">
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs">Workouts</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Progress</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
