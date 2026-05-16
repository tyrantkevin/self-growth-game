import { useRecordStore } from '../stores/recordStore'
import { motion } from 'framer-motion'
import { Smartphone, Moon, Smile, TrendingUp, TrendingDown, Award } from 'lucide-react'

export function WeeklyReport() {
  const { weekRecords } = useRecordStore()

  if (weekRecords.length < 2) {
    return (
      <motion.div
        className="bg-white rounded-xl p-6 text-center border border-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Award className="w-10 h-10 text-slate-200 mx-auto mb-2" />
        <p className="text-sm text-slate-500">打卡满一周后，这里会生成你的周总结报告</p>
      </motion.div>
    )
  }

  const daysWithData = weekRecords.filter(r => r.xpEarned > 0).length
  const totalXP = weekRecords.reduce((sum, r) => sum + r.xpEarned, 0)
  const avgScreenTime = weekRecords.reduce((sum, r) => sum + r.screenTimeHours + r.screenTimeMinutes / 60, 0) / weekRecords.length
  const avgMood = weekRecords.reduce((sum, r) => sum + r.moodScore, 0) / weekRecords.length
  const avgSleepQuality = weekRecords.reduce((sum, r) => sum + r.sleepQuality, 0) / weekRecords.length

  const bestDay = weekRecords.reduce((best, r) => r.moodScore > best.moodScore ? r : best, weekRecords[0])

  const insights = [
    {
      label: '打卡天数',
      value: `${daysWithData}/7天`,
      icon: Award,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
      good: daysWithData >= 5
    },
    {
      label: '平均屏幕时间',
      value: `${avgScreenTime.toFixed(1)}h`,
      icon: Smartphone,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
      good: avgScreenTime < 4
    },
    {
      label: '平均情绪',
      value: `${avgMood.toFixed(1)}分`,
      icon: Smile,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      good: avgMood >= 7
    },
    {
      label: '睡眠质量',
      value: `${avgSleepQuality.toFixed(1)}星`,
      icon: Moon,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      good: avgSleepQuality >= 3.5
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">本周总结</h2>

      {/* 总览卡片 */}
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalXP} XP</div>
            <div className="text-xs text-slate-500">本周获得总经验</div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            daysWithData >= 5 ? 'bg-success-100' : 'bg-warning-100'
          }`}>
            {daysWithData >= 5 ? (
              <TrendingUp className="w-6 h-6 text-success-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-warning-500" />
            )}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          {daysWithData >= 5
            ? '本周表现很棒！保持了良好的打卡习惯。'
            : '本周打卡次数偏少，下周一起加油！'}
        </div>
      </motion.div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-2 gap-3">
        {insights.map((item, idx) => (
          <motion.div
            key={item.label}
            className="bg-white rounded-xl p-3 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-2`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-800">{item.value}</div>
            <div className="text-[10px] text-slate-400">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 最佳一天 */}
      {bestDay && (
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm font-semibold text-slate-700 mb-2">心情最好的一天</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{bestDay.date}</div>
              <div className="text-sm text-slate-700 mt-1">
                {bestDay.moodNote || '没有记录心情笔记'}
              </div>
            </div>
            <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-bold text-lg">
              {bestDay.moodScore}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
