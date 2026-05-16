import { useState, useEffect } from 'react'
import { useUserStore } from '../stores/userStore'
import { useAchievements } from '../hooks/useAchievements'
import { db } from '../db/database'
import { motion } from 'framer-motion'
import { Rocket, Flame, Crown, Sun, Smartphone, Smile, Moon, Bed, Lock, Star } from 'lucide-react'
import type { DailyRecord } from '../types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Flame,
  Crown,
  Sun,
  Smartphone,
  Smile,
  Moon,
  Bed
}

export function Achievements() {
  const [allRecords, setAllRecords] = useState<DailyRecord[]>([])
  const userProfile = useUserStore()

  useEffect(() => {
    db.records.toArray().then(setAllRecords)
  }, [userProfile.totalXP])

  const profile = {
    id: userProfile.id,
    name: userProfile.name,
    totalXP: userProfile.totalXP,
    totalCoins: userProfile.totalCoins,
    currentStreak: userProfile.currentStreak,
    longestStreak: userProfile.longestStreak,
    lastCheckInDate: userProfile.lastCheckInDate,
    createdAt: userProfile.createdAt
  }

  const achievements = useAchievements(allRecords, profile)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">成就墙</h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((ach, idx) => {
          const Icon = iconMap[ach.icon] || Star
          return (
            <motion.div
              key={ach.id}
              className={`relative rounded-xl p-4 border-2 transition-all ${
                ach.unlocked
                  ? 'bg-white border-primary-200 shadow-sm'
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: ach.unlocked ? 1 : 0.6, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              {ach.unlocked && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </motion.div>
              )}

              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                ach.unlocked ? 'bg-primary-100' : 'bg-slate-200'
              }`}>
                {ach.unlocked ? (
                  <Icon className="w-5 h-5 text-primary-600" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <h3 className={`text-sm font-bold mb-0.5 ${ach.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                {ach.name}
              </h3>
              <p className={`text-[11px] leading-tight mb-2 ${ach.unlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                {ach.description}
              </p>

              {ach.unlocked && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                    +{ach.rewardXP} XP
                  </span>
                  <span className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium">
                    +{ach.rewardCoins} 金币
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {unlockedCount === 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 text-center border border-slate-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Rocket className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-500">完成第一次打卡，解锁你的第一个成就！</p>
        </motion.div>
      )}
    </div>
  )
}
