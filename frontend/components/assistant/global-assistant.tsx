'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Loader2, Send, X, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAssistant } from '@/components/assistant/assistant-provider'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export function GlobalAssistant() {
  const { open, setOpen } = useAssistant()
  type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
    audioUrl?: string
    audioStatus?: 'loading' | 'ready' | 'error'
  }

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [pendingTranscript, setPendingTranscript] = useState('')
  const [pendingVoiceMessage, setPendingVoiceMessage] = useState<string | null>(null)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    if (typeof window !== 'undefined') {
      window.addEventListener('open-assistant', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-assistant', handler)
      }
    }
  }, [setOpen])

  useEffect(() => {
    const storedPreference =
      typeof window !== 'undefined' ? window.localStorage.getItem('fitstreak_voice_enabled') : null
    if (storedPreference) {
      setVoiceEnabled(storedPreference === 'true')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fitstreak_voice_enabled', voiceEnabled ? 'true' : 'false')
    }
  }, [voiceEnabled])

  const createId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random()}`
  }

  const sendMessage = async (textOverride?: string) => {
    if (loading) return
    const text = (textOverride ?? input).trim()
    if (!text) return
    const userMessage: ChatMessage = { id: createId(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    if (!textOverride) {
      setInput('')
    }
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error('Failed to reach the assistant')
      }

      const data = await response.text()
      const assistantId = createId()
      const streamUrl = `/api/voice-stream?text=${encodeURIComponent(data)}`
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: data,
        audioUrl: voiceEnabled ? streamUrl : undefined,
      }
      setMessages((prev) => [...prev, assistantMessage])
      if (voiceEnabled) {
        playAudio(streamUrl)
      }
    } catch (error) {
      console.error(error)
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: 'I had trouble responding. Please try again.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    if (!voiceEnabled) return
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.audioUrl) return
    const audio = new Audio(lastMessage.audioUrl)
    audio
      .play()
      .catch(() => {
        // Ignore autoplay errors; user can manually trigger playback.
      })
    return () => {
      audio.pause()
    }
  }, [messages, voiceEnabled])

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    audio.play().catch(() => {
      // ignore
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }
    const recognition: any = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setSpeechError(null)
      setPendingTranscript('')
    }
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setPendingTranscript(transcript)
      if (event.results[event.results.length - 1].isFinal) {
        const finalText = transcript.trim()
        setPendingTranscript('')
        if (finalText) {
          setPendingVoiceMessage(finalText)
        }
      }
    }
    recognition.onerror = (event: any) => {
      setSpeechError(event.error)
      setIsListening(false)
    }
    recognition.onend = () => {
      setIsListening(false)
      setPendingTranscript('')
    }
    recognitionRef.current = recognition
    return () => {
      recognition.stop()
    }
  }, [])

  useEffect(() => {
    if (pendingVoiceMessage) {
      sendMessage(pendingVoiceMessage)
      setPendingVoiceMessage(null)
    }
  }, [pendingVoiceMessage])

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch {
        // ignore double starts
      }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <Button
          className="rounded-full px-4 py-3 shadow-lg bg-primary text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Chat
        </Button>
      )}

      {open && (
        <Card className="w-80 sm:w-96 shadow-2xl border-white/10 bg-card/90 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">FitStreak Coach</p>
              <p className="text-xs text-muted-foreground">Ask me about training or recovery</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setVoiceEnabled((prev) => !prev)}
                aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-80">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground">Start the conversation with a training question.</p>
            )}
            {messages.map((message, index) => (
              <div key={message.id} className="flex flex-col">
                <div
                  className={
                    message.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-3 py-2 text-sm'
                      : 'mr-auto max-w-[85%] rounded-2xl bg-white/5 text-sm px-3 py-2'
                  }
                >
                  {message.content}
                </div>
                {message.role === 'assistant' && message.audioUrl && (
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-2 text-[11px]',
                      message.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/80',
                    )}
                  >
                    <button
                      type="button"
                      className="text-xs underline-offset-2 hover:underline"
                      onClick={() => playAudio(message.audioUrl!)}
                    >
                      Replay voice
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking…
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3 space-y-2">
            <div className="flex gap-2 items-end">
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'outline'}
                onClick={toggleListening}
                disabled={!speechSupported || loading}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 h-16 resize-none rounded-lg bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ask for workout ideas, tips…"
                disabled={loading}
              />
              <Button type="button" size="icon" onClick={() => sendMessage()} disabled={loading} className="self-end">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-primary">
                Listening…{' '}
                {pendingTranscript && <span className="italic">{pendingTranscript}</span>}
              </p>
            )}
            {!speechSupported && (
              <p className="text-xs text-muted-foreground">
                Voice input isn’t supported in this browser. Try Chrome or Edge.
              </p>
            )}
            {speechError && (
              <p className="text-xs text-destructive">Voice input error: {speechError}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
