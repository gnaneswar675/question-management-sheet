import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import DifficultyBadge from "./DifficultyBadge"
import ConfirmModal from "./ConfirmModal"
import { IconGrip, IconEdit, IconTrash, IconCheck, IconX, IconExternalLink, IconVideo, IconYouTube, PlatformIcon } from "./Icons"

export default function Question({ question, dragHandleProps }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(question.title)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const editQuestion = useSheetStore((s) => s.editQuestion)
  const deleteQuestion = useSheetStore((s) => s.deleteQuestion)
  const toggleSolved = useSheetStore((s) => s.toggleSolved)

  const handleSaveEdit = () => {
    if (editText.trim()) {
      editQuestion(question._id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleToggleSolved = () => {
    if (toggleSolved) {
      toggleSolved(question._id)
    }
  }

  // Extract platform from question data
  const platform = question.questionId?.platform || 'generic'
  const difficulty = question.questionId?.difficulty || question.difficulty || 'Medium'
  const problemUrl = question.questionId?.problemUrl || question.problemUrl
  const resourceUrl = question.resource

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-amber-500 rounded-lg shadow-lg">
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit()
            if (e.key === 'Escape') {
              setEditText(question.title)
              setIsEditing(false)
            }
          }}
          autoFocus
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
        />
        <button
          onClick={handleSaveEdit}
          className="p-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
        >
          <IconCheck size={16} />
        </button>
        <button
          onClick={() => {
            setEditText(question.title)
            setIsEditing(false)
          }}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <IconX size={16} />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="group flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 shadow-sm hover:shadow-md">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="text-slate-400 dark:text-slate-600 cursor-grab hover:text-slate-600 dark:hover:text-slate-400 active:cursor-grabbing transition-colors"
        >
          <IconGrip size={14} />
        </div>

        {/* Solved Checkbox */}
        <button
          onClick={handleToggleSolved}
          className={`flex items-center justify-center w-5 h-5 min-w-[20px] rounded-lg border-2 transition-all active:scale-95 ${
            question.isSolved 
              ? 'bg-green-500 border-green-500 shadow-sm shadow-green-500/20' 
              : 'bg-transparent border-slate-300 dark:border-slate-600 hover:border-amber-500'
          }`}
        >
          {question.isSolved && (
            <IconCheck size={12} className="text-white" />
          )}
        </button>

        {/* Platform Icon */}
        <div className="text-slate-500 dark:text-slate-500">
          <PlatformIcon platform={platform} url={problemUrl} size={18} />
        </div>

        {/* Question Title */}
        <span
          className={`flex-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${
            question.isSolved 
              ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400 dark:decoration-slate-500' 
              : 'text-slate-700 dark:text-slate-200 font-medium'
          }`}
          title={question.title}
        >
          {question.title}
        </span>

        {/* Difficulty Badge */}
        <DifficultyBadge difficulty={difficulty} />

        {/* Links */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {problemUrl && (
            <a
              href={problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
              title="Problem Link"
            >
              <IconExternalLink size={18} />
            </a>
          )}
          {resourceUrl && (
            <a
              href={resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-90 ${
                resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be')
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Video Resource"
            >
              {resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be') ? (
                <IconYouTube size={18} />
              ) : (
                <IconVideo size={18} />
              )}
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-90"
            title="Edit"
          >
            <IconEdit size={16} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
            title="Delete"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteQuestion(question._id)}
        title="Delete Question"
        message={`Are you sure you want to delete "${question.title}"?`}
        confirmText="Delete"
        danger
      />
    </>
  )
}
