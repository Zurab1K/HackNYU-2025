import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const text: string | undefined = body?.text

  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!apiKey || !voiceId) {
    return NextResponse.json({ error: 'Voice configuration missing' }, { status: 500 })
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.9,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to synthesize voice')
    return NextResponse.json({ error: errorText }, { status: 500 })
  }

  const audioBuffer = await response.arrayBuffer()
  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
