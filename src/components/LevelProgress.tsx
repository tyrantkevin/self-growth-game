import { useUserStore } from '../stores/userStore'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

export function LevelProgress() {
  const { totalXP, getLevelInfo } = useUserStore()
  const { level, currentXP, xpToNext, progress } = getLevelInfo()

  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-primary-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">Lv.{level}</div>
            <div className="text-xs text-slate-500">当前等级</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">{totalXP}</div>
          <div className="text-xs text-slate-500">总经验值</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>升到 Lv.{level + 1}</span>
          <span>{currentXP} / {xpToNext} XP</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
