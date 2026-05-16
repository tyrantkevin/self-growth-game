import { useMemo } from 'react'
import type { DailyRecord, UserProfile, Achievement } from '../types'

export function getAchievements(): Achievement[] {
  return [
    {
      id: 'first-checkin',
      name: '启程',
      description: '完成第一次打卡',
      icon: 'Rocket',
      condition: (records) => records.length >= 1,
      unlocked: false,
      rewardXP: 50,
      rewardCoins: 10
    },
    {
      id: 'streak-3',
      name: '初露锋芒',
      description: '连续打卡3天',
      icon: 'Flame',
      condition: (_, profile) => profile.currentStreak >= 3,
      unlocked: false,
      rewardXP: 100,
      rewardCoins: 20
    },
    {
      id: 'streak-7',
      name: '坚持不懈',
      description: '连续打卡7天',
      icon: 'Flame',
      condition: (_, profile) => profile.currentStreak >= 7,
      unlocked: false,
      rewardXP: 250,
      rewardCoins: 50
    },
    {
      id: 'streak-30',
      name: '习惯成自然',
      description: '连续打卡30天',
      icon: 'Crown',
      condition: (_, profile) => profile.currentStreak >= 30,
      unlocked: false,
      rewardXP: 1000,
      rewardCoins: 200
    },
    {
      id: 'early-bird',
      name: '早起鸟',
      description: '连续7天在8点前起床',
      icon: 'Sun',
      condition: (records) => {
        if (records.length < 7) return false
        const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
        const last7 = sorted.slice(0, 7)
        return last7.every(r => {
          const hour = parseInt(r.sleepEnd.split(':')[0])
          return hour < 8 || (hour === 8 && parseInt(r.sleepEnd.split(':')[1]) === 0)
        })
      },
      unlocked: false,
      rewardXP: 200,
      rewardCoins: 30
    },
    {
      id: 'digital-detox',
      name: '数字排毒',
      description: '连续3天屏幕时间小于3小时',
      icon: 'Smartphone',
      condition: (records) => {
        const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
        const last3 = sorted.slice(0, 3)
        if (last3.length < 3) return false
        return last3.every(r => r.screenTimeHours < 3 || (r.screenTimeHours === 3 && r.screenTimeMinutes === 0))
      },
      unlocked: false,
      rewardXP: 150,
      rewardCoins: 25
    },
    {
      id: 'mood-master',
      name: '情绪稳定器',
      description: '连续7天情绪评分大于等于7分',
      icon: 'Smile',
      condition: (records) => {
        if (records.length < 7) return false
        const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
        const last7 = sorted.slice(0, 7)
        return last7.every(r => r.moodScore >= 7)
      },
      unlocked: false,
      rewardXP: 200,
      rewardCoins: 30
    },
    {
      id: 'sleep-master',
      name: '睡眠大师',
      description: '连续7天睡眠时长超过7小时',
      icon: 'Moon',
      condition: (records) => {
        if (records.length < 7) return false
        const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
        const last7 = sorted.slice(0, 7)
        return last7.every(r => {
          const start = r.sleepStart.split(':').map(Number)
          const end = r.sleepEnd.split(':').map(Number)
          let hours = end[0] - start[0]
          let mins = end[1] - start[1]
          if (mins < 0) { hours -= 1; mins += 60 }
          if (hours < 0) hours += 24
          return hours + mins / 60 >= 7
        })
      },
      unlocked: false,
      rewardXP: 200,
      rewardCoins: 30
    },
    {
      id: 'night-owl-no-more',
      name: '告别夜猫子',
      description: '连续7天在23点前睡觉',
      icon: 'Bed',
      condition: (records) => {
        if (records.length < 7) return false
        const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
        const last7 = sorted.slice(0, 7)
        return last7.every(r => {
          const hour = parseInt(r.sleepStart.split(':')[0])
          return hour <= 23
        })
      },
      unlocked: false,
      rewardXP: 200,
      rewardCoins: 30
    }
  ]
}

export function useAchievements(records: DailyRecord[], profile: UserProfile): Achievement[] {
  return useMemo(() => {
    const achievements = getAchievements()
    return achievements.map(ach => ({
      ...ach,
      unlocked: ach.condition(records, profile)
    }))
  }, [records, profile])
}
