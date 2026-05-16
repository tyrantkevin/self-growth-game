import { create } from 'zustand'
import type { UserProfile } from '../types'
import { db, initProfile } from '../db/database'
import { getTodayStr, getYesterdayStr, calculateLevel } from '../lib/utils'

interface UserState extends UserProfile {
  initialized: boolean
  init: () => Promise<void>
  addXP: (amount: number) => Promise<void>
  addCoins: (amount: number) => Promise<void>
  checkIn: () => Promise<void>
  updateName: (name: string) => Promise<void>
  getLevelInfo: () => { level: number; currentXP: number; xpToNext: number; progress: number }
}

export const useUserStore = create<UserState>((set, get) => ({
  id: undefined,
  name: '修行者',
  totalXP: 0,
  totalCoins: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCheckInDate: null,
  createdAt: new Date(),
  initialized: false,

  init: async () => {
    const profile = await initProfile()
    set({ ...profile, initialized: true })
  },

  addXP: async (amount) => {
    const newXP = get().totalXP + amount
    const id = get().id
    if (id) {
      await db.profile.update(id, { totalXP: newXP })
      set({ totalXP: newXP })
    }
  },

  addCoins: async (amount) => {
    const newCoins = get().totalCoins + amount
    const id = get().id
    if (id) {
      await db.profile.update(id, { totalCoins: newCoins })
      set({ totalCoins: newCoins })
    }
  },

  checkIn: async () => {
    const today = getTodayStr()
    const yesterday = getYesterdayStr()
    const lastDate = get().lastCheckInDate
    const id = get().id

    if (lastDate === today) return

    let newStreak = 1
    if (lastDate === yesterday) {
      newStreak = get().currentStreak + 1
    }

    const longestStreak = Math.max(get().longestStreak, newStreak)

    if (id) {
      await db.profile.update(id, {
        lastCheckInDate: today,
        currentStreak: newStreak,
        longestStreak
      })
      set({ lastCheckInDate: today, currentStreak: newStreak, longestStreak })
    }
  },

  updateName: async (name) => {
    const id = get().id
    if (id) {
      await db.profile.update(id, { name })
      set({ name })
    }
  },

  getLevelInfo: () => calculateLevel(get().totalXP)
}))
