import { useUserStore } from '../stores/userStore'

export function useStreak() {
  const { currentStreak, longestStreak, lastCheckInDate } = useUserStore()

  const isActiveToday = lastCheckInDate === new Date().toISOString().split('T')[0]

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    streakBonus: isActiveToday ? 1 + currentStreak * 0.1 : 1
  }
}
