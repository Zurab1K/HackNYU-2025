'use client'

import axios from 'axios'
import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AmbientBackground } from '@/components/layout/ambient-background'

export default function WorkoutAssistant() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const getResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const reply = await axios.post('http://localhost:8000/ai', {
        message: question,
      })
      setResponse(reply.data)
    } catch (err) {
      console.error('Error fetching response:', err)
      setError('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AmbientBackground className="px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Coach
          </div>
          <h1 className="text-4xl font-semibold text-foreground">Workout Assistant</h1>
          <p className="text-base text-muted-foreground">
            Ask for programming tweaks, substitutions, or warm-up ideas and get a thoughtful reply.
          </p>
        </div>

        <Card className="space-y-6 p-8">
          <form onSubmit={getResponse} className="space-y-4">
            <label className="text-sm font-medium text-foreground" htmlFor="question">
              What do you need help with?
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. “Need a low-impact leg session for hotel gym equipment.”"
              rows={4}
              className="w-full resize-none rounded-3xl border border-border/80 bg-white/80 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="h-12 w-full rounded-full text-base font-semibold"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Thinking…
                </>
              ) : (
                'Ask the assistant'
              )}
            </Button>
          </form>

          {response && (
            <div className="rounded-3xl border border-border/70 bg-white/70 p-6 text-sm text-foreground shadow-inner">
              <p className="whitespace-pre-line leading-relaxed">{response}</p>
            </div>
          )}
        </Card>
      </div>
    </AmbientBackground>
  )
}
