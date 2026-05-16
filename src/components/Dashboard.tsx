import { useRecordStore } from '../stores/recordStore'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Smartphone, Moon, Smile, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatDate } from '../lib/utils'

export function Dashboard() {
  const { weekRecords } = useRecordStore()

  const chartData = weekRecords.map(r => ({
    date: formatDate(r.date),
    screenTime: r.screenTimeHours + r.screenTimeMinutes / 60,
    sleepHours: (() => {
      const start = r.sleepStart.split(':').map(Number)
      const end = r.sleepEnd.split(':').map(Number)
      let hours = end[0] - start[0]
      let mins = end[1] - start[1]
      if (mins < 0) { hours -= 1; mins += 60 }
      if (hours < 0) hours += 24
      return hours + mins / 60
    })(),
    mood: r.moodScore,
    sleepQuality: r.sleepQuality
  }))

  const avgScreenTime = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.screenTime, 0) / chartData.length
    : 0
  const avgSleep = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.sleepHours, 0) / chartData.length
    : 0
  const avgMood = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length
    : 0

  const stats = [
    {
      label: '平均屏幕时间',
      value: `${avgScreenTime.toFixed(1)}h`,
      icon: Smartphone,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
      trend: (avgScreenTime < 4 ? 'down' : avgScreenTime > 6 ? 'up' : 'flat') as 'down' | 'up' | 'flat'
    },
    {
      label: '平均睡眠时长',
      value: `${avgSleep.toFixed(1)}h`,
      icon: Moon,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      trend: (avgSleep >= 7 ? 'up' : avgSleep < 6 ? 'down' : 'flat') as 'down' | 'up' | 'flat'
    },
    {
      label: '平均情绪评分',
      value: avgMood.toFixed(1),
      icon: Smile,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      trend: (avgMood >= 7 ? 'up' : avgMood < 5 ? 'down' : 'flat') as 'down' | 'up' | 'flat'
    }
  ]

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-success-500" />
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
    return <Minus className="w-3.5 h-3.5 text-slate-400" />
  }

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl p-3 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-800">{stat.value}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendIcon trend={stat.trend} />
              <span className="text-[10px] text-slate-400">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 屏幕时间趋势 */}
      {chartData.length > 1 && (
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary-500" />
            屏幕时间趋势
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="screenTimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${Number(value).toFixed(1)}小时`, '屏幕时间']}
              />
              <Area type="monotone" dataKey="screenTime" stroke="#0ea5e9" strokeWidth={2} fill="url(#screenTimeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* 睡眠趋势 */}
      {chartData.length > 1 && (
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            睡眠时长趋势
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${Number(value).toFixed(1)}小时`, '睡眠时长']}
              />
              <Area type="monotone" dataKey="sleepHours" stroke="#6366f1" strokeWidth={2} fill="url(#sleepGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* 情绪趋势 */}
      {chartData.length > 1 && (
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-500" />
            情绪评分趋势
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[1, 10]} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${Number(value)}分`, '情绪评分']}
              />
              <Line type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {chartData.length <= 1 && (
        <motion.div
          className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">坚持打卡几天后，这里会显示你的数据趋势图</p>
        </motion.div>
      )}
    </div>
  )
}
