import { useUserStore } from '../stores/userStore'
import { Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
  const { name, totalCoins, currentStreak, getLevelInfo } = useUserStore()
  const levelInfo = getLevelInfo()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
            {name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">{name}</h1>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="text-primary-600 font-semibold">Lv.{levelInfo.level}</span>
              <span>·</span>
              <span>{levelInfo.currentXP}/{levelInfo.xpToNext} XP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-3.5 h-3.5" />
            {totalCoins}
          </motion.div>

          <motion.div
            className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-3.5 h-3.5" />
            {currentStreak}天
          </motion.div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-2">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </header>
  )
}
