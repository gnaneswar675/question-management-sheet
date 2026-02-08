import ProgressRing from './ProgressRing'
import StatsCard from './StatsCard'
import { IconFolder, IconCheck, IconBookmark, IconSun, IconMoon } from './Icons'
import { useTheme } from '../hooks/useTheme'

export default function Header({ sheet, questions }) {
  const { theme, toggleTheme } = useTheme()

  // Calculate stats
  const totalQuestions = questions?.filter(q => !q.isPlaceholder).length || 0
  const solvedQuestions = questions?.filter(q => q.isSolved).length || 0
  const totalTopics = sheet?.config?.topicOrder?.length || 0
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0
  
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Top Row - Title and Progress */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Left - Sheet Info */}
          <div className="flex-1 min-w-[280px]">
             <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
                {sheet?.name || 'Question Sheet'}
              </h1>
              {/* Mobile Toggle (visible on small screens if needed, but here we keep it simple) */}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-[600px] mb-3 transition-colors">
              {sheet?.description?.slice(0, 150)}
              {sheet?.description?.length > 150 ? '...' : ''}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {sheet?.tag?.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500 capitalize border border-amber-100 dark:border-transparent transition-colors"
                >
                  {tag}
                </span>
              ))}
              {sheet?.followers && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors">
                  <IconBookmark size={12} />
                  {sheet.followers.toLocaleString()} followers
                </span>
              )}
            </div>
          </div>
          
          {/* Right - Progress & Theme Toggle */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <ProgressRing progress={progress} size={80} strokeWidth={6} />
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-500 transition-colors">
                  Progress
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
                  {solvedQuestions} / {totalQuestions}
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mt-6">
          <StatsCard
            label="Total Questions"
            value={totalQuestions}
            icon={<IconBookmark size={20} />}
            color="primary"
          />
          <StatsCard
            label="Solved"
            value={solvedQuestions}
            icon={<IconCheck size={20} />}
            color="success"
          />
          <StatsCard
            label="Topics"
            value={totalTopics}
            icon={<IconFolder size={20} />}
            color="info"
          />
        </div>
      </div>
    </header>
  )
}
