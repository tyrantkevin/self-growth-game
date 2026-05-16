import { useState, useEffect } from 'react'
import { useUserStore } from './stores/userStore'
import { useRecordStore } from './stores/recordStore'
import { Header } from './components/Header'
import { LevelProgress } from './components/LevelProgress'
import { StreakBadge } from './components/StreakBadge'
import { DailyCheckIn } from './components/DailyCheckIn'
import { Dashboard } from './components/Dashboard'
import { Achievements } from './components/Achievements'
import { WeeklyReport } from './components/WeeklyReport'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, BarChart3, Trophy, FileText } from 'lucide-react'

type TabType = 'checkin' | 'dashboard' | 'achievements' | 'report'

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'checkin', label: '打卡', icon: CheckCircle2 },
  { id: 'dashboard', label: '数据', icon: BarChart3 },
  { id: 'achievements', label: '成就', icon: Trophy },
  { id: 'report', label: '总结', icon: FileText }
]

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('checkin')
  const { initialized: userInit, init: initUser } = useUserStore()
  const { initialized: recordInit, init: initRecords } = useRecordStore()

  useEffect(() => {
    initUser()
    initRecords()
  }, [])

  if (!userInit || !recordInit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 pb-24">
        {/* 顶部状态卡片 */}
        {activeTab === 'checkin' && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <LevelProgress />
            <StreakBadge />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'checkin' && <DailyCheckIn />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'achievements' && <Achievements />}
            {activeTab === 'report' && <WeeklyReport />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className={`text-[11px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 w-8 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
