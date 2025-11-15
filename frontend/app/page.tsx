'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dumbbell } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'landing' | 'signin' | 'signup'>('landing')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
name: ''
  })

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (authMode === 'signup' && formData.name && formData.email && formData.password) {
      localStorage.setItem('user_name', formData.name)
      router.push('/welcome')
    } else if (authMode === 'signin' && formData.email && formData.password) {
      router.push('/welcome')
    }
  }

  if (authMode === 'landing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-12 animate-gentle-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-chart-5">
                <Dumbbell className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">FitStreak</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight text-foreground">
              Start Your Journey
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Join thousands building the next generation of fitness habits
            </p>
          </div>

          {/* Gradient Buttons matching reference image */}
          <div className="space-y-4 max-w-md mx-auto pt-8">
            <button
              onClick={() => setAuthMode('signin')}
              className="w-full h-14 rounded-xl text-white font-medium text-lg gradient-glow-button"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className="w-full h-14 rounded-xl text-white font-medium text-lg gradient-glow-button-secondary"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-gentle-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-chart-5">
              <Dumbbell className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">FitStreak</span>
          </div>
        </div>

        <Card className="p-8 border border-border shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {authMode === 'signup' ? 'Start your fitness journey today' : 'Continue your fitness journey'}
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
                  className="h-11 bg-background border-border focus:border-primary transition-colors"
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
                className="h-11 bg-background border-border focus:border-primary transition-colors"
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
                className="h-11 bg-background border-border focus:border-primary transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-6 text-base gradient-glow-button"
            >
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {authMode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setAuthMode('landing')}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
