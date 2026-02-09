// src/App.jsx
import { useEffect, useState } from "react"
import { fetchSheet } from "./api/sheetApi"
import { useSheetStore } from "./store/sheetStore"
import Topic from "./components/Topic"
import Header from "./components/Header"
import Modal from "./components/Modal"
import { IconPlus, IconSearch } from "./components/Icons"

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

import Loader from "./components/Loader"

function App() {
  const setSheet = useSheetStore((s) => s.setSheet)
  const sheetData = useSheetStore((s) => s.sheet)

  const addTopic = useSheetStore((s) => s.addTopic)
  const reorderTopics = useSheetStore((s) => s.reorderTopics)
  const reorderSubTopics = useSheetStore((s) => s.reorderSubTopics)
  const reorderQuestions = useSheetStore((s) => s.reorderQuestions)

  const [showAddTopic, setShowAddTopic] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchSheet().then(setSheet)
  }, [])

  useEffect(() => {
    if (sheetData) {
      const qTotal = sheetData.questions.filter(q => !q.isPlaceholder).length
      const qSolved = sheetData.questions.filter(q => !q.isPlaceholder && q.isSolved).length
      const percent = qTotal > 0 ? Math.round((qSolved / qTotal) * 100) : 0
      const sheetName = sheetData.sheet.name || "Question Management"
      
      document.title = `${sheetName} | ${percent}% Solved`
    }
  }, [sheetData])

  if (!sheetData) {
    return <Loader />
  }

  const sheet = sheetData.sheet
  const topics = sheet.config.topicOrder
  const questions = sheetData.questions
  const subTopicOrder = sheet.config.subTopicOrder || {}

  const hierarchy = {}

  topics.forEach((topic) => {
    hierarchy[topic] = {}
    const subs = subTopicOrder[topic] || []
    subs.forEach((s) => (hierarchy[topic][s] = []))
  })

  questions.forEach((q) => {
    const t = q.topic
    const s = q.subTopic || "General"
    if (!hierarchy[t]) hierarchy[t] = {}
    if (!hierarchy[t][s]) hierarchy[t][s] = []
    hierarchy[t][s].push(q)
  })

  const filteredTopics = searchQuery.trim()
    ? topics.filter(topic => {
        const matchesTopic = topic.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubtopic = Object.keys(hierarchy[topic] || {}).some(sub =>
          sub.toLowerCase().includes(searchQuery.toLowerCase())
        )
        const matchesQuestion = Object.values(hierarchy[topic] || {}).some(qs =>
          qs.some(q => q.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        return matchesTopic || matchesSubtopic || matchesQuestion
      })
    : topics

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { type, source, destination } = result

    if (type === "TOPIC") {
      reorderTopics(source.index, destination.index)
      return
    }

    if (type === "SUBTOPIC") {
      const topic = source.droppableId.replace("subtopics-", "")
      reorderSubTopics(topic, source.index, destination.index)
      return
    }

    if (type === "QUESTION") {
      const [, topic, subTopic] = destination.droppableId.split("::")

      reorderQuestions(
        topic,
        subTopic,
        source.index,
        destination.index
      )
    }
  }

  const handleAddTopic = () => {
    if (!newTopic.trim()) return
    addTopic(newTopic.trim())
    setNewTopic("")
    setShowAddTopic(false)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header sheet={sheet} questions={questions} />

        <main className="max-w-[1400px] mx-auto p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors">
                <IconSearch size={18} />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 placeholder-slate-500 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all shadow-sm"
              />
            </div>

            <button
              onClick={() => setShowAddTopic(true)}
              className="group flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-slate-900 dark:bg-amber-500 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 hover:shadow-lg transition-all shadow-md"
            >
              <IconPlus size={18} className="transition-transform group-hover:rotate-90" />
              Add Topic
            </button>
          </div>

          <Droppable droppableId="topics" type="TOPIC">
            {(p) => (
              <div
                ref={p.innerRef}
                {...p.droppableProps}
                className="flex flex-col gap-4"
              >
                {filteredTopics.length === 0 && searchQuery && (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
                {filteredTopics.map((topic, i) => (
                  <Draggable
                    key={topic}
                    draggableId={topic}
                    index={i}
                  >
                    {(p, snapshot) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        className={`transition-opacity duration-200 ${
                          snapshot.isDragging ? 'opacity-80' : 'opacity-100'
                        }`}
                        style={{
                          ...p.draggableProps.style,
                        }}
                      >
                        <Topic
                          topic={topic}
                          subTopics={hierarchy[topic] || {}}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {p.placeholder}
              </div>
            )}
          </Droppable>

          {topics.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-slate-500">
              <div className="text-lg mb-2">No topics yet</div>
              <div className="text-sm">Click "Add Topic" to get started</div>
            </div>
          )}
        </main>

        <Modal
          isOpen={showAddTopic}
          onClose={() => {
            setShowAddTopic(false)
            setNewTopic("")
          }}
          title="Create New Topic"
          size="sm"
        >
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 mb-6">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Topic Name <span className="text-red-500">*</span>
              </label>
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g., Arrays..."
                className="w-full px-4 py-3 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-slate-900 dark:text-slate-100 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTopic()
                }}
              />
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddTopic(false)}
                className="px-6 py-3 text-base font-semibold text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                className="px-6 py-3 text-base font-semibold text-slate-900 bg-amber-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={!newTopic.trim()}
              >
                Create Topic
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DragDropContext>
  )
}

export default App