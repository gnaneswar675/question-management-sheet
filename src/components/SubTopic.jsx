import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import Question from "./Question"
import ConfirmModal from "./ConfirmModal"
import Modal from "./Modal"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { IconGrip, IconPlus, IconEdit, IconTrash, IconCheck, IconChevronDown } from "./Icons"

export default function SubTopic({ topic, subTopic, questions }) {
  const [newQ, setNewQ] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(subTopic)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Form state for adding question
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    difficulty: 'Medium',
    resource: '',
  })

  const addQuestion = useSheetStore((s) => s.addQuestion)
  const editSubTopic = useSheetStore((s) => s.editSubTopic)
  const deleteSubTopic = useSheetStore((s) => s.deleteSubTopic)
  const config = useSheetStore((s) => s.sheet.sheet.config)

  // Filter out placeholder questions
  const realQuestions = questions?.filter((q) => !q.isPlaceholder) || []
  
  // Get question order from config
  const key = `${topic}::${subTopic}`
  const questionOrder = config.questionOrder?.[key] || realQuestions.map(q => q._id)
  
  // Sort questions by order
  const orderedQuestions = [...realQuestions].sort((a, b) => {
    const indexA = questionOrder.indexOf(a._id)
    const indexB = questionOrder.indexOf(b._id)
    return indexA - indexB
  })

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== subTopic && editSubTopic) {
      editSubTopic(topic, subTopic, editName.trim())
    }
    setIsEditing(false)
  }

  const handleAddQuestion = () => {
    if (!newQuestion.title.trim()) return
    
    addQuestion({
      title: newQuestion.title.trim(),
      topic,
      subTopic,
      difficulty: newQuestion.difficulty,
      resource: newQuestion.resource,
      isSolved: false,
    })
    
    setNewQuestion({ title: '', difficulty: 'Medium', resource: '' })
    setShowAddModal(false)
  }

  const solvedCount = realQuestions.filter(q => q.isSolved).length
  const isAllSolved = solvedCount === realQuestions.length && realQuestions.length > 0

  return (
    <>
      <div>
        {/* SubTopic Header */}
        <div className="flex items-center justify-between mb-3">
          {/* Left - Title */}
          <div className="flex items-center gap-3 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1 max-w-[300px]">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') {
                      setEditName(subTopic)
                      setIsEditing(false)
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  <IconCheck size={14} />
                </button>
              </div>
            ) : (
              <h3 className="text-base font-medium text-slate-700 dark:text-slate-200 m-0">
                {subTopic}
              </h3>
            )}
            
            {/* Count Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border transition-colors ${
                isAllSolved
                  ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-500 dark:border-transparent'
                  : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-500 dark:border-transparent'
              }`}
            >
              {solvedCount}/{realQuestions.length}
            </span>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all active:scale-90"
              title="Add Question"
            >
              <IconPlus size={16} />
            </button>
            {editSubTopic && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-90"
                title="Edit SubTopic"
              >
                <IconEdit size={16} />
              </button>
            )}
            {deleteSubTopic && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                title="Delete SubTopic"
              >
                <IconTrash size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Questions List */}
        <Droppable droppableId={`questions::${topic}::${subTopic}`} type="QUESTION">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2 min-h-[20px]"
            >
              {orderedQuestions.length === 0 && (
                <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  No questions yet. Click + to add one.
                </div>
              )}
              {orderedQuestions.map((q, index) => (
                <Draggable key={q._id} draggableId={q._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-opacity duration-200 ${
                        snapshot.isDragging ? 'opacity-80' : 'opacity-100'
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Question
                        question={q}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteSubTopic && deleteSubTopic(topic, subTopic)}
        title="Delete Subtopic"
        message={`Are you sure you want to delete "${subTopic}"? All questions in this subtopic will also be removed.`}
        confirmText="Delete"
        danger
      />

      {/* Add Question Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Question"
        size="md"
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Question Title <span className="text-red-500">*</span>
            </label>
            <input
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              placeholder="e.g., Two Sum, Reverse Linked List..."
              className="w-full px-4 py-3 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 placeholder-slate-500 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Difficulty
            </label>
            <div className="relative">
              <select
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                className="w-full px-4 py-3 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-slate-900 dark:text-slate-100 transition-all appearance-none cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <IconChevronDown size={12} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Resource URL (optional)
            </label>
            <input
              value={newQuestion.resource}
              onChange={(e) => setNewQuestion({ ...newQuestion, resource: e.target.value })}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-3 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 placeholder-slate-500 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
              Link to the problem or a video tutorial.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-6 py-3 min-h-[3.25rem] text-base font-semibold text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors min-w-[100px]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddQuestion}
              className="px-6 py-3 min-h-[3.25rem] text-base font-semibold text-slate-900 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
              disabled={!newQuestion.title.trim()}
            >
              Add Question
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
