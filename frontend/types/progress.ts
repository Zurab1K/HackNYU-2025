export type ProgressMilestone = {
  label: string
  value: number
  delta: number
}

export type ProgressLift = {
  id: string
  name: string
  current: number
  previous: number
}

export type BodyCompositionEntry = {
  label: string
  value: number
  unit: string
}

export type ProgressResponse = {
  readiness: number
  recovery: number
  trend: number[]
  milestones: ProgressMilestone[]
  lifts: ProgressLift[]
  bodyComposition: BodyCompositionEntry[]
}
