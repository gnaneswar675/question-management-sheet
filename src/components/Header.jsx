// src/components/Header.jsx
import ProgressRing from './ProgressRing'
import StatsCard from './StatsCard'
import { IconFolder, IconCheck, IconBookmark, IconSun, IconMoon } from './Icons'
import { useTheme } from '../hooks/useTheme'

export default function Header({ sheet, questions }) {
  const { theme, toggleTheme } = useTheme()

  // Calculate stats accurately from the questions list
  const totalQuestions = questions?.filter(q => !q.isPlaceholder).length || 0
  const solvedQuestions = questions?.filter(q => q.isSolved).length || 0
  const totalTopics = sheet?.config?.topicOrder?.length || 0
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0

  // Truncation Logic: Display until "Flipkart, etc" then append "..."
  const fullDescription = sheet?.description || "";
  const targetKeyword = "Flipkart, etc";
  const keywordIndex = fullDescription.indexOf(targetKeyword);
  
  const truncatedDescription = keywordIndex !== -1 
    ? `${fullDescription.slice(0, keywordIndex + targetKeyword.length)}...`
    : fullDescription;
  
  return (
    <header className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 relative">
        
        {/* Main Layout Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          {/* Left Section: Title, Description & Badges */}
          {/* flex-grow and min-w-0 allow the text to expand on desktop */}
          <div className="flex-grow min-w-0 md:pr-4"> 
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white transition-colors">
                {sheet?.name || 'Striver SDE Sheet'}
              </h1>
              
              {/* Mobile Toggle Button - Hidden on Desktop */}
              <button
                onClick={toggleTheme}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all"
              >
                {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </button>
            </div>

            {/* DESCRIPTION: Truncated for both views as requested */}
            <div className="mt-3">
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                {truncatedDescription}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-5">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Popular
              </span>
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                <IconBookmark size={14} />
                {sheet?.followers?.toLocaleString() || '10,709'} followers
              </span>
            </div>
          </div>

          {/* Right Section: Progress & Desktop Toggle */}
          {/* flex-shrink-0 prevents this area from being squeezed by the expanded text */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-end gap-6 md:gap-8 mt-4 md:mt-0">
            
            {/* Progress Container - Now to the left of the button on desktop */}
            <div className="flex items-center gap-4">
              <ProgressRing progress={progress} size={80} strokeWidth={8} />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {solvedQuestions} / {totalQuestions}
                </span>
              </div>
            </div>

            {/* Desktop Toggle Button - Positioned to the far right */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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