import Dexie, { type Table } from 'dexie'
import type { DailyRecord, UserProfile } from '../types'

class GrowthDatabase extends Dexie {
  records!: Table<DailyRecord>
  profile!: Table<UserProfile>

  constructor() {
    super('SelfGrowthGame')
    this.version(1).stores({
      records: '++id, date',
      profile: '++id'
    })
  }
}

export const db = new GrowthDatabase()

export async function initProfile(): Promise<UserProfile> {
  let profile = await db.profile.toCollection().first()
  if (!profile) {
    const newProfile: Omit<UserProfile, 'id'> = {
      name: '修行者',
      totalXP: 0,
      totalCoins: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      createdAt: new Date()
    }
    const id = await db.profile.add(newProfile)
    profile = { ...newProfile, id } as UserProfile
  }
  return profile as UserProfile
}

export async function getOrCreateTodayRecord(date: string): Promise<DailyRecord> {
  let record = await db.records.where('date').equals(date).first()
  if (!record) {
    const newRecord: Omit<DailyRecord, 'id'> = {
      date,
      screenTimeHours: 0,
      screenTimeMinutes: 0,
      sleepStart: '23:00',
      sleepEnd: '07:00',
      sleepQuality: 3,
      moodScore: 5,
      moodNote: '',
      habits: [
        { id: 'no-short-video', name: '没刷短视频', completed: false },
        { id: 'read-book', name: '阅读30分钟', completed: false },
        { id: 'exercise', name: '运动', completed: false },
        { id: 'no-phone-before-bed', name: '睡前1小时不碰手机', completed: false }
      ],
      xpEarned: 0,
      createdAt: new Date()
    }
    const id = await db.records.add(newRecord)
    record = { ...newRecord, id } as DailyRecord
  }
  return record
}
