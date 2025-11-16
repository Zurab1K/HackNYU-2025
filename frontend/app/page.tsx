'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, CheckCircle2, Dumbbell, ShieldCheck, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { safeSetItem } from '@/lib/safe-storage'

type FeatureHighlight = {
  title: string
  description: string
  icon: LucideIcon
}

type StatHighlight = {
  value: string
  label: string
}

const heroFeatures: FeatureHighlight[] = [
  {
    title: 'Adaptive coaching',
    description: 'Daily programs respond to your schedule, energy, and focus.',
    icon: Sparkles,
  },
  {
    title: 'Mindful metrics',
    description: 'Minimal dashboards highlight trends you can actually use.',
    icon: Activity,
  },
  {
    title: 'Grounded accountability',
    description: 'Gentle nudges and weekly recaps written by real coaches.',
    icon: ShieldCheck,
  },
]

const coachChecklist = [
  'Complimentary onboarding call with a human coach',
  'Weekly habit reviews, recovery, and breathwork prompts',
  'Library of short, cinematic routines filmed in daylight',
]

export default function LandingPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'landing' | 'signin' | 'signup'>('landing')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const googleAuthUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL
    if (base) return base
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'
    return `${apiBase.replace(/\/api$/, '')}/auth/google`
  }, [])

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthUrl
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (authMode === 'signup' && formData.name && formData.email && formData.password) {
      safeSetItem('user_name', formData.name)
      router.push('/welcome')
    } else if (authMode === 'signin' && formData.email && formData.password) {
      router.push('/welcome')
    }
  }

  if (authMode === 'landing') {
    return (
      <BackgroundShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-3 text-primary-foreground shadow-lg">
                <Dumbbell className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">FitStreak</p>
                <p className="text-sm text-muted-foreground">Movement for ambitious weeks</p>
              </div>
            </div>
          </header>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8 md:space-y-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground shadow-sm backdrop-blur">
                Human-first training OS
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Calm, considered fitness for modern life.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  Rituals that elevate your energy, sharpen focus, and feel at home in your routine. Zero noise, just thoughtful programming.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {heroFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-border/50 bg-white/70 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.08)] backdrop-blur"
                  >
                    <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-foreground">
                      <feature.icon className="h-5 w-5 text-primary" />
                      {feature.title}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="h-14 w-full rounded-full text-base font-medium gradient-glow-button sm:w-auto sm:min-w-[220px]"
                >
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="h-14 w-full rounded-full text-base font-medium gradient-glow-button-secondary sm:w-auto sm:min-w-[220px]"
                >
                  Use email instead
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Secure by Google OAuth & private infrastructure.</p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[32px] border border-border/60 bg-white/80 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl !py-0">
                <div className="space-y-6 px-8 py-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weekly momentum</p>
                      <p className="text-3xl font-semibold text-foreground">Quiet confidence</p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Personalised blocks for strength, recovery, and breathwork—delivered with the warmth of a private studio coach.
                  </p>

                  <div className="space-y-4">
                    {coachChecklist.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <p className="text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </Card>
            </div>
          </div>
        </div>
      </BackgroundShell>
    )
  }

  return (
    <BackgroundShell>
      <div className="mx-auto w-full max-w-md animate-gentle-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-2.5 text-primary-foreground shadow-lg">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">FitStreak</p>
              <p className="text-sm text-muted-foreground">A calmer way to stay consistent</p>
            </div>
          </div>
        </div>

        <Card className="rounded-[32px] border border-border/60 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl !py-0">
          <div className="px-8 pb-8 pt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                {authMode === 'signup' ? 'Create your studio' : 'Welcome back'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {authMode === 'signup'
                  ? 'Set intentions, unlock streaks, and glide through the week.'
                  : 'Drop back into your plan in seconds.'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-2xl border border-border/60 bg-white/80 px-4 text-base text-foreground placeholder:text-muted-foreground/70 shadow-inner focus:border-primary/40 focus:bg-white"
                    required={authMode === 'signup'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-2xl border border-border/60 bg-white/80 px-4 text-base text-foreground placeholder:text-muted-foreground/70 shadow-inner focus:border-primary/40 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 rounded-2xl border border-border/60 bg-white/80 px-4 text-base text-foreground placeholder:text-muted-foreground/70 shadow-inner focus:border-primary/40 focus:bg-white"
                  required
                />
              </div>

              <button type="submit" className="mt-6 h-12 w-full rounded-full text-base font-semibold gradient-glow-button">
                {authMode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {authMode === 'signup' ? 'Already have an account? Sign in' : "Need an invite? Create an account"}
              </button>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setAuthMode('landing')}
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  ← Back to overview
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Secure by Google OAuth & private infrastructure. Cancel anytime.
            </p>
          </div>
        </Card>
      </div>
    </BackgroundShell>
  )
}

function BackgroundShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.08),rgba(14,165,233,0.05))]" />
        <div className="absolute left-[-10%] top-[-20%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-15%] bottom-[-15%] h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)',
            backgroundSize: '120px 120px',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
