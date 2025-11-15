'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('there')

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    if (name) {
      setUserName(name.split(' ')[0])
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-gentle-fade-in">
        {/* Simple icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
          </div>
        </div>

        {/* Welcome message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight text-foreground">
            Welcome, {userName}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Let's take a moment to personalize your fitness journey
          </p>
        </div>

        {/* Simple feature list */}
        <div className="pt-8 pb-4 space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-muted-foreground">Build sustainable workout habits</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-muted-foreground">Track your progress with ease</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-muted-foreground">Stay motivated with daily check-ins</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            size="lg"
            className="h-12 px-10 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push('/onboarding')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes 2 minutes
          </p>
        </div>
      </div>
    </div>
  )
}
