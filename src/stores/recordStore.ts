import { create } from 'zustand'
import type { DailyRecord, HabitCheck } from '../types'
import { db, getOrCreateTodayRecord } from '../db/database'
import { getTodayStr, getWeekDates } from '../lib/utils'

interface RecordState {
  todayRecord: DailyRecord | null
  weekRecords: DailyRecord[]
  initialized: boolean
  init: () => Promise<void>
  saveRecord: (record: Partial<DailyRecord>) => Promise<void>
  toggleHabit: (habitId: string) => Promise<void>
  reloadWeekRecords: () => Promise<void>
}

export const useRecordStore = create<RecordState>((set, get) => ({
  todayRecord: null,
  weekRecords: [],
  initialized: false,

  init: async () => {
    const today = getTodayStr()
    const record = await getOrCreateTodayRecord(today)
    const weekDates = getWeekDates()
    const allRecords = await db.records.toArray()
    const weekRecords = weekDates
      .map(d => allRecords.find(r => r.date === d))
      .filter((r): r is DailyRecord => !!r)
    set({ todayRecord: record, weekRecords, initialized: true })
  },

  saveRecord: async (partial) => {
    const today = getTodayStr()
    const existing = await getOrCreateTodayRecord(today)
    const updated = { ...existing, ...partial }
    if (updated.id) {
      await db.records.update(updated.id, updated)
    }
    set({ todayRecord: updated })
    await get().reloadWeekRecords()
  },

  toggleHabit: async (habitId) => {
    const record = get().todayRecord
    if (!record || !record.id) return

    const habits = record.habits.map((h: HabitCheck) =>
      h.id === habitId ? { ...h, completed: !h.completed } : h
    )

    await db.records.update(record.id, { habits })
    set({ todayRecord: { ...record, habits } })
  },

  reloadWeekRecords: async () => {
    const weekDates = getWeekDates()
    const allRecords = await db.records.toArray()
    const weekRecords = weekDates
      .map(d => allRecords.find(r => r.date === d))
      .filter((r): r is DailyRecord => !!r)
    set({ weekRecords })
  }
}))
