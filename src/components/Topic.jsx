import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import SubTopic from "./SubTopic"
import ConfirmModal from "./ConfirmModal"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { IconGrip, IconPlus, IconEdit, IconTrash, IconChevronDown, IconCheck } from "./Icons"

export default function Topic({ topic, subTopics }) {
  const [newSub, setNewSub] = useState("")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(topic)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const addSubTopic = useSheetStore((s) => s.addSubTopic)
  const editTopic = useSheetStore((s) => s.editTopic)
  const deleteTopic = useSheetStore((s) => s.deleteTopic)
  const config = useSheetStore((s) => s.sheet.sheet.config)

  // Source of truth for subtopic order
  const orderedSubTopics = config.subTopicOrder?.[topic] || Object.keys(subTopics)
  
  // Calculate question count
  const questionCount = Object.values(subTopics).reduce(
    (sum, qs) => sum + qs.filter(q => !q.isPlaceholder).length, 
    0
  )
  const solvedCount = Object.values(subTopics).reduce(
    (sum, qs) => sum + qs.filter(q => q.isSolved && !q.isPlaceholder).length, 
    0
  )

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== topic) {
      editTopic(topic, editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <>
      <div 
        className={`bg-white dark:bg-slate-800 border transition-all duration-300 rounded-xl overflow-hidden ${
          open 
            ? 'border-amber-500/30 ring-1 ring-amber-500/30 shadow-lg dark:shadow-slate-900/50' 
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        }`}
      >
        {/* TOPIC HEADER */}
        <div
          className={`flex items-center justify-between px-6 py-5 cursor-pointer transition-colors duration-200 ${
            open ? 'bg-slate-50/50 dark:bg-slate-700/20' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'
          }`}
          onClick={() => setOpen((o) => !o)}
        >
          {/* Left side - Chevron and Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ease-out ${
                open ? 'rotate-0 text-amber-500' : '-rotate-90'
              }`}
            >
              <IconChevronDown size={20} />
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') {
                      setEditName(topic)
                      setIsEditing(false)
                    }
                  }}
                  autoFocus
                  className="flex-1 max-w-[300px] px-3 py-2 text-lg font-semibold bg-white dark:bg-slate-900 border border-amber-500 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveEdit()
                  }}
                  className="p-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <IconCheck size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col min-w-0">
                <h2 className={`text-lg font-bold m-0 truncate transition-colors ${open ? 'text-amber-600 dark:text-amber-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {topic}
                </h2>
                {/* Subtopic Tag Strip */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 overflow-hidden">
                  {orderedSubTopics.slice(0, 3).map((sub, idx) => {
                    const subQs = subTopics[sub] || []
                    const qReal = subQs.filter(q => !q.isPlaceholder)
                    const qSolved = qReal.filter(q => q.isSolved).length
                    const isFullySolved = qReal.length > 0 && qSolved === qReal.length
                    const isPartiallySolved = qSolved > 0 && qSolved < qReal.length
                    
                    return (
                      <span 
                        key={idx}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all duration-300 truncate max-w-[100px] ${
                          isFullySolved 
                            ? 'bg-green-50/50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20' 
                            : isPartiallySolved 
                              ? 'bg-amber-50/50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20' 
                              : 'bg-slate-50/50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
                        }`}
                        title={`${sub}: ${qSolved}/${qReal.length} solved`}
                      >
                        {sub}
                      </span>
                    )
                  })}
                  {orderedSubTopics.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      +{orderedSubTopics.length - 3} more
                    </span>
                  )}
                  {orderedSubTopics.length === 0 && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                      No Subtopics
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Progress and Actions */}
          <div className="flex items-center gap-6">
            {/* Visual Progress Bar */}
            <div className="hidden md:flex flex-col items-end gap-1.5 min-w-[120px]">
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Progress
                </span>
                <span className={`text-[11px] font-bold ${
                  solvedCount === questionCount && questionCount > 0 
                    ? 'text-green-500' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {Math.round((solvedCount / (questionCount || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    solvedCount === questionCount && questionCount > 0
                      ? 'bg-green-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${(solvedCount / (questionCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all active:scale-90"
                title="Edit Topic"
              >
                <IconEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteModal(true)
                }}
                className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                title="Delete Topic"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {open && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-700/50 animate-fade-in origin-top">
            {/* ADD SUBTOPIC */}
            <div className="flex gap-3 my-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  New Subtopic
                </label>
                <input
                  placeholder="e.g. Priority Queue, Binary Search..."
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSub.trim()) {
                      addSubTopic(topic, newSub.trim())
                      setNewSub("")
                    }
                  }}
                className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  if (!newSub.trim()) return
                  addSubTopic(topic, newSub.trim())
                  setNewSub("")
                }}
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none min-h-[44px]"
                disabled={!newSub.trim()}
              >
                <IconPlus size={16} className="transition-transform group-hover:rotate-90" />
                Add
              </button>
            </div>
            </div>

            {/* SUBTOPICS */}
            <Droppable droppableId={`subtopics-${topic}`} type="SUBTOPIC">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-4 mt-2"
                >
                  {orderedSubTopics.map((sub, index) => (
                    <Draggable
                      key={sub}
                      draggableId={`${topic}-${sub}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group border rounded-xl p-1 transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'bg-white dark:bg-slate-800 border-amber-500 shadow-xl scale-105 z-50' 
                              : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="flex items-stretch">
                            {/* Drag Handle Strip */}
                            <div
                              {...provided.dragHandleProps}
                              className="w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-l-lg transition-colors border-r border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                            >
                              <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
                                <IconGrip size={16} />
                              </div>
                            </div>

                            <div className="flex-1 p-3 pl-1">
                              <SubTopic
                                topic={topic}
                                subTopic={sub}
                                questions={subTopics[sub] || []}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {orderedSubTopics.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                      <p className="text-slate-400 dark:text-slate-600 text-sm">
                        No subtopics yet. Add one above to start organizing.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteTopic(topic)}
        title="Delete Topic"
        message={`Are you sure you want to delete "${topic}"? This will also remove all subtopics and questions under it.`}
        confirmText="Delete"
        danger
      />
    </>
  )
}
