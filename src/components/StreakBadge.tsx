import { useUserStore } from '../stores/userStore'
import { Flame, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export function StreakBadge() {
  const { currentStreak, longestStreak } = useUserStore()

  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={currentStreak > 0 ? {
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame className={`w-10 h-10 ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-300'}`} />
            </motion.div>
            {currentStreak > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {currentStreak}
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-slate-800">连续打卡</div>
            <div className="text-xs text-slate-500">
              {currentStreak > 0 ? '保持势头！' : '今天还没打卡哦'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-slate-400">
            <Award className="w-4 h-4" />
            <span className="text-xs">最高纪录</span>
          </div>
          <div className="text-lg font-bold text-slate-600">{longestStreak}天</div>
        </div>
      </div>
    </motion.div>
  )
}
