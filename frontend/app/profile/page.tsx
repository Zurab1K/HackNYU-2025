'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfileData } from '@/hooks/useProfileData'
import type { ProfileDetails } from '@/types/profile'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { AmbientBackground } from '@/components/layout/ambient-background'

export default function ProfilePage() {
  const { data, loading, error, refresh, save, saving, success } = useProfileData()
  const [formState, setFormState] = useState<ProfileDetails | null>(null)

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const updateField = <T extends keyof ProfileDetails>(section: T, key: keyof ProfileDetails[T], value: string | number) => {
    setFormState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }
    })
  }

  const handleSave = () => {
    if (formState && !saving) {
      save(formState)
    }
  }

  const renderBody = () => {
    if (loading || !formState) {
      return (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">{loading ? 'Loading profile…' : 'No profile data'}</p>
        </Card>
      )
    }

    return (
      <div className="space-y-8">
        <Card className="p-6 border border-white/5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Personal details</h3>
              <p className="text-xs text-muted-foreground">Make sure your information is up to date</p>
            </div>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sync
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Name"
              value={formState.personal.name}
              onChange={(value) => updateField('personal', 'name', value)}
            />
            <Field
              label="Email"
              value={formState.personal.email}
              onChange={(value) => updateField('personal', 'email', value)}
            />
            <Field
              label="Age"
              type="number"
              value={formState.personal.age.toString()}
              onChange={(value) => updateField('personal', 'age', Number(value))}
            />
            <Field
              label="Gender"
              value={formState.personal.gender}
              onChange={(value) => updateField('personal', 'gender', value)}
            />
          </div>
        </Card>

        <Card className="p-6 border border-white/5 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Body metrics</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Field
              label="Height (cm)"
              type="number"
              value={formState.metrics.height.toString()}
              onChange={(value) => updateField('metrics', 'height', Number(value))}
            />
            <Field
              label="Weight (lb)"
              type="number"
              value={formState.metrics.weight.toString()}
              onChange={(value) => updateField('metrics', 'weight', Number(value))}
            />
            <Field
              label="Body status"
              value={formState.metrics.bodyStatus}
              onChange={(value) => updateField('metrics', 'bodyStatus', value)}
            />
          </div>
        </Card>

        <Card className="p-6 border border-white/5 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Training preferences</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Goal focus"
              value={formState.preferences.goalFocus}
              onChange={(value) => updateField('preferences', 'goalFocus', value)}
            />
            <Field
              label="Sessions per week"
              type="number"
              value={formState.preferences.preferredSchedule.toString()}
              onChange={(value) => updateField('preferences', 'preferredSchedule', Number(value))}
            />
            <Field
              label="Preferred time"
              value={formState.preferences.preferredTime}
              onChange={(value) => updateField('preferences', 'preferredTime', value)}
            />
            <Field
              label="Intensity"
              value={formState.preferences.preferredIntensity}
              onChange={(value) => updateField('preferences', 'preferredIntensity', value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button className="h-11" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : 'Save updates'}
            </Button>
            {success && <p className="text-xs text-emerald-300 text-center">{success}</p>}
            {error && !loading && <p className="text-xs text-destructive text-center">{error}</p>}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AmbientBackground className="pb-24">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Profile</p>
          <h1 className="text-4xl font-semibold text-foreground">Your Preferences</h1>
          <p className="text-base text-muted-foreground">Tune the plan to your lifestyle.</p>
        </div>

        {renderBody()}
      </div>

      <BottomNav />
    </AmbientBackground>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

const Field = ({ label, value, onChange, type = 'text' }: FieldProps) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <Input
      value={value}
      type={type}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-border/70 bg-white/80 px-4"
    />
  </div>
)
