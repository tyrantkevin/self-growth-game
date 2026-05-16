export interface DailyRecord {
  id?: number
  date: string // YYYY-MM-DD
  screenTimeHours: number
  screenTimeMinutes: number
  sleepStart: string // HH:mm
  sleepEnd: string // HH:mm
  sleepQuality: number // 1-5
  moodScore: number // 1-10
  moodNote: string
  habits: HabitCheck[]
  xpEarned: number
  createdAt: Date
}

export interface HabitCheck {
  id: string
  name: string
  completed: boolean
}

export interface UserProfile {
  id?: number
  name: string
  totalXP: number
  totalCoins: number
  currentStreak: number
  longestStreak: number
  lastCheckInDate: string | null
  createdAt: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (records: DailyRecord[], profile: UserProfile) => boolean
  unlocked: boolean
  unlockedAt?: Date
  rewardXP: number
  rewardCoins: number
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly'
  target: number
  current: number
  unit: string
  completed: boolean
  createdAt: Date
  expiresAt: Date
}
