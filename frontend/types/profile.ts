export type ProfileDetails = {
  personal: {
    name: string
    email: string
    age: number
    gender: string
  }
  metrics: {
    height: number
    weight: number
    bodyStatus: string
  }
  preferences: {
    goalFocus: string
    preferredSchedule: number
    preferredTime: string
    preferredIntensity: 'low' | 'moderate' | 'high'
  }
}
