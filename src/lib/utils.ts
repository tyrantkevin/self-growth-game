import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function getYesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function getWeekDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export function calculateLevel(xp: number): { level: number; currentXP: number; xpToNext: number; progress: number } {
  const level = Math.floor(xp / 500) + 1
  const currentXP = xp % 500
  const xpToNext = 500
  const progress = (currentXP / xpToNext) * 100
  return { level, currentXP, xpToNext, progress }
}
