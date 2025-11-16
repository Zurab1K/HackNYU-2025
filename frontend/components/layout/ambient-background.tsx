import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AmbientBackground({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden bg-background', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-[-35%] h-[40rem] rounded-[50%] bg-gradient-to-t from-primary/5 via-transparent to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)',
            backgroundSize: '140px 140px',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
