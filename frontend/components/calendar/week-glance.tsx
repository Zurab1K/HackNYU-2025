import { useMemo, useState } from 'react'
import type { WeekPlanEntry } from '@/types/workouts'
import { cn } from '@/lib/utils'

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const statusStyles: Record<WeekPlanEntry['status'], string> = {
  planned: 'border-border/70 bg-white/80 text-foreground',
  complete: 'border-primary/50 bg-primary/10 text-primary',
  rest: 'border-dashed border-muted text-muted-foreground',
}

type WeekGlanceProps = {
  plan: WeekPlanEntry[]
  onUpdate?: (plan: WeekPlanEntry[]) => void
  disabled?: boolean
}

export function WeekGlance({ plan, onUpdate, disabled = false }: WeekGlanceProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const ordered = useMemo(
    () => DAY_ORDER.map((day) => plan.find((entry) => entry.day === day) ?? { day, focus: 'Recovery', status: 'rest' }),
    [plan],
  )

  const handleDrop = (targetDay: string) => {
    if (!dragging || dragging === targetDay || !onUpdate) return
    const sourceIndex = ordered.findIndex((entry) => entry.day === dragging)
    const targetIndex = ordered.findIndex((entry) => entry.day === targetDay)
    if (sourceIndex === -1 || targetIndex === -1) return
    const next = [...ordered]
    ;[next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]]
    onUpdate(next)
    setDragging(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Week at a glance</p>
          <h3 className="text-lg font-semibold text-foreground">{disabled ? 'Preview your blocks' : 'Drag to reorder blocks'}</h3>
        </div>
        {!disabled && <p className="text-xs text-muted-foreground">Grab any card and move it to a new day</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {ordered.map((entry) => (
          <div
            key={entry.day}
            draggable={!disabled}
            onDragStart={() => !disabled && setDragging(entry.day)}
            onDragOver={(event) => !disabled && event.preventDefault()}
            onDrop={() => !disabled && handleDrop(entry.day)}
            onDragEnd={() => setDragging(null)}
            className={cn(
              'rounded-2xl border px-3 py-4 text-left transition select-none',
              statusStyles[entry.status],
              !disabled && 'cursor-move',
              dragging === entry.day && 'ring-2 ring-primary/50',
            )}
          >
            <p className="text-xs uppercase tracking-wide">{entry.day}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{entry.focus}</p>
            <p className="text-xs text-muted-foreground capitalize">{entry.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
