'use client'

import { useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

export function Fireworks({ show }: { show: boolean }) {
  const bursts = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        left: `${15 + index * 13}%`,
        top: `${25 + (index % 3) * 15}%`,
        delay: `${index * 80}ms`,
      })),
    [],
  )

  useEffect(() => {
    if (!show) return
  }, [show])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className={cn('firework-burst absolute h-2 w-2 rounded-full')}
          style={{ left: burst.left, top: burst.top, animationDelay: burst.delay }}
        />
      ))}
    </div>
  )
}
