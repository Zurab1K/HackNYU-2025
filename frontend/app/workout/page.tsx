'use client'
import axios from 'axios'
import { useState } from 'react'

export default function Workout() {
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
            const response = await axios.post('http://localhost:8000/ai', {
                message: question
            });
            setResponse(response.data)
        } catch (err) {
            console.error('Error fetching response:', err)
            setError('Failed to get response. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Workout Assistant</h1>

            <form onSubmit={getResponse} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask me anything about workouts..."
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: (isLoading || !question.trim()) ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Thinking...' : 'Ask'}
                    </button>
                </div>
            </form>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
            )}

            {response && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    whiteSpace: 'pre-line'
                }}>
                    {response}
                </div>
            )}
        </div>
    )
}