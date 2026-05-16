import { useState, useEffect } from 'react'
import { useRecordStore } from '../stores/recordStore'
import { useUserStore } from '../stores/userStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Moon, Sun, Smile, Check, Plus, X } from 'lucide-react'
import { getTodayStr } from '../lib/utils'
import type { HabitCheck } from '../types'

export function DailyCheckIn() {
  const { todayRecord, saveRecord, toggleHabit, init } = useRecordStore()
  const { checkIn, addXP, addCoins, currentStreak } = useUserStore()
  const [saved, setSaved] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [showAddHabit, setShowAddHabit] = useState(false)

  useEffect(() => {
    init()
  }, [])

  if (!todayRecord) return null

  const completedHabits = todayRecord.habits.filter(h => h.completed).length
  const totalHabits = todayRecord.habits.length
  const habitBonus = completedHabits * 20
  const streakMultiplier = 1 + currentStreak * 0.1
  const estimatedXP = Math.round((100 + habitBonus) * streakMultiplier)

  const handleSave = async () => {
    await checkIn()
    const baseXP = 100
    const habitXP = completedHabits * 20
    const totalXP = Math.round((baseXP + habitXP) * streakMultiplier)
    const coins = Math.round(totalXP / 5)

    await saveRecord({
      ...todayRecord,
      xpEarned: totalXP
    })

    await addXP(totalXP)
    await addCoins(coins)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const isTodayChecked = todayRecord.xpEarned > 0

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return
    const newHabit: HabitCheck = {
      id: `custom-${Date.now()}`,
      name: newHabitName.trim(),
      completed: false
    }
    const updatedHabits = [...todayRecord.habits, newHabit]
    saveRecord({ habits: updatedHabits })
    setNewHabitName('')
    setShowAddHabit(false)
  }

  const handleRemoveHabit = (habitId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedHabits = todayRecord.habits.filter(h => h.id !== habitId)
    saveRecord({ habits: updatedHabits })
  }

  return (
    <div className="space-y-4">
      {/* 顶部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">今日打卡</h2>
          <p className="text-xs text-slate-500">{getTodayStr()}</p>
        </div>
        {isTodayChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            已打卡 +{todayRecord.xpEarned} XP
          </motion.div>
        )}
      </div>

      {/* 屏幕时间 */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-slate-700">屏幕时间</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">小时</label>
            <input
              type="number"
              min={0}
              max={24}
              value={todayRecord.screenTimeHours}
              onChange={e => saveRecord({ screenTimeHours: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <span className="text-slate-400 mt-5">:</span>
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">分钟</label>
            <input
              type="number"
              min={0}
              max={59}
              value={todayRecord.screenTimeMinutes}
              onChange={e => saveRecord({ screenTimeMinutes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </motion.div>

      {/* 睡眠记录 */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-700">睡眠记录</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">就寝时间</label>
            <input
              type="time"
              value={todayRecord.sleepStart}
              onChange={e => saveRecord({ sleepStart: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <span className="text-slate-300 mt-5">→</span>
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">起床时间</label>
            <input
              type="time"
              value={todayRecord.sleepEnd}
              onChange={e => saveRecord({ sleepEnd: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-2">睡眠质量</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => saveRecord({ sleepQuality: star })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  todayRecord.sleepQuality >= star
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                {star}星
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 情绪日记 */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Smile className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-slate-700">情绪日记</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>很低落</span>
            <span className="font-bold text-amber-600">{todayRecord.moodScore}分</span>
            <span>超开心</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={todayRecord.moodScore}
            onChange={e => saveRecord({ moodScore: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between mt-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <span key={n} className={`text-xs ${n === todayRecord.moodScore ? 'text-amber-600 font-bold' : 'text-slate-300'}`}>
                {n}
              </span>
            ))}
          </div>
        </div>
        <textarea
          placeholder="今天发生了什么？写下你的心情..."
          value={todayRecord.moodNote}
          onChange={e => saveRecord({ moodNote: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
      </motion.div>

      {/* 习惯打卡 */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success-500" />
            <span className="font-semibold text-slate-700">习惯打卡</span>
            <span className="text-xs text-slate-400">({completedHabits}/{totalHabits})</span>
          </div>
          <button
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            添加
          </button>
        </div>

        <AnimatePresence>
          {showAddHabit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                  placeholder="输入新习惯..."
                  className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                  autoFocus
                />
                <button
                  onClick={handleAddHabit}
                  className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                >
                  确定
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {todayRecord.habits.map((habit, idx) => (
            <motion.button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                habit.completed
                  ? 'bg-success-50 border-success-200'
                  : 'bg-slate-50 border-transparent hover:bg-slate-100'
              }`}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                habit.completed
                  ? 'bg-success-500 border-success-500'
                  : 'border-slate-300'
              }`}>
                {habit.completed && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={`flex-1 text-sm font-medium ${habit.completed ? 'text-success-700 line-through' : 'text-slate-700'}`}>
                {habit.name}
              </span>
              {habit.id.startsWith('custom-') && (
                <button
                  onClick={(e) => handleRemoveHabit(habit.id, e)}
                  className="text-slate-300 hover:text-danger-500 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 保存按钮 */}
      <AnimatePresence>
        {!isTodayChecked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.button
              onClick={handleSave}
              className="w-full py-3.5 bg-primary-500 text-white rounded-xl font-bold text-base shadow-lg shadow-primary-200 hover:bg-primary-600 active:scale-[0.98] transition-all"
              whileTap={{ scale: 0.98 }}
            >
              完成打卡 · 预计 +{estimatedXP} XP
            </motion.button>
            <p className="text-center text-xs text-slate-400 mt-2">
              基础100 XP + 习惯{habitBonus} XP × 连击加成{streakMultiplier.toFixed(1)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-success-200 text-center">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: 2, duration: 0.5 }}
              >
                <Sun className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">打卡成功！</h3>
              <p className="text-sm text-slate-500">+{estimatedXP} XP · +{Math.round(estimatedXP / 5)} 金币</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
