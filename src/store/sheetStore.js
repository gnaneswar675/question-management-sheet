import { create } from "zustand"

export const useSheetStore = create((set) => ({
  sheet: null,

  setSheet: (data) => set({ sheet: data }),

  /* ================= TOPIC CRUD ================= */

  addTopic: (topicName) =>
    set((state) => {
      if (!state.sheet) return {}

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...state.sheet.sheet.config,
              topicOrder: [
                ...state.sheet.sheet.config.topicOrder,
                topicName,
              ],
            },
          },
        },
      }
    }),

  editTopic: (oldName, newName) =>
    set((state) => {
      if (!state.sheet) return {}

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...state.sheet.sheet.config,
              topicOrder: state.sheet.sheet.config.topicOrder.map((t) =>
                t === oldName ? newName : t
              ),
            },
          },
          questions: state.sheet.questions.map((q) =>
            q.topic === oldName ? { ...q, topic: newName } : q
          ),
        },
      }
    }),

  deleteTopic: (topicName) =>
    set((state) => {
      if (!state.sheet) return {}

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...state.sheet.sheet.config,
              topicOrder: state.sheet.sheet.config.topicOrder.filter(
                (t) => t !== topicName
              ),
            },
          },
          questions: state.sheet.questions.filter(
            (q) => q.topic !== topicName
          ),
        },
      }
    }),

  /* ================= SUBTOPIC CREATE ================= */

  addSubTopic: (topic, subTopic) =>
  set((state) => {
    if (!state.sheet) return {}

    const config = state.sheet.sheet.config

    // All existing subtopics (derived from questions)
    const existingSubTopics = Array.from(
      new Set(
        state.sheet.questions
          .filter((q) => q.topic === topic)
          .map((q) => q.subTopic || "General")
      )
    )

    // Already exists? do nothing
    if (existingSubTopics.includes(subTopic)) return {}

    const prevOrder = config.subTopicOrder?.[topic] || existingSubTopics

    return {
      sheet: {
        ...state.sheet,
        sheet: {
          ...state.sheet.sheet,
          config: {
            ...config,
            subTopicOrder: {
              ...config.subTopicOrder,
              [topic]: [...prevOrder, subTopic], // ✅ MERGE
            },
          },
        },
        questions: [
          ...state.sheet.questions,
          {
            _id: crypto.randomUUID(),
            title: "",
            topic,
            subTopic,
            isPlaceholder: true,
          },
        ],
      },
    }
  }),

  editSubTopic: (topic, oldSub, newSub) =>
    set((state) => {
      if (!state.sheet) return {}
      const config = state.sheet.sheet.config

      const newSubTopicOrder = { ...config.subTopicOrder }
      if (newSubTopicOrder[topic]) {
        newSubTopicOrder[topic] = newSubTopicOrder[topic].map((s) =>
          s === oldSub ? newSub : s
        )
      }

      const newQuestionOrder = { ...config.questionOrder }
      const oldKey = `${topic}::${oldSub}`
      const newKey = `${topic}::${newSub}`
      if (newQuestionOrder[oldKey]) {
        newQuestionOrder[newKey] = newQuestionOrder[oldKey]
        delete newQuestionOrder[oldKey]
      }

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...config,
              subTopicOrder: newSubTopicOrder,
              questionOrder: newQuestionOrder,
            },
          },
          questions: state.sheet.questions.map((q) =>
            q.topic === topic && q.subTopic === oldSub
              ? { ...q, subTopic: newSub }
              : q
          ),
        },
      }
    }),

  deleteSubTopic: (topic, subTopic) =>
    set((state) => {
      if (!state.sheet) return {}
      const config = state.sheet.sheet.config

      const newSubTopicOrder = { ...config.subTopicOrder }
      if (newSubTopicOrder[topic]) {
        newSubTopicOrder[topic] = newSubTopicOrder[topic].filter(
          (s) => s !== subTopic
        )
      }

      const newQuestionOrder = { ...config.questionOrder }
      delete newQuestionOrder[`${topic}::${subTopic}`]

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...config,
              subTopicOrder: newSubTopicOrder,
              questionOrder: newQuestionOrder,
            },
          },
          questions: state.sheet.questions.filter(
            (q) => !(q.topic === topic && q.subTopic === subTopic)
          ),
        },
      }
    }),

  /* ================= QUESTION CRUD ================= */

  addQuestion: (question) =>
    set((state) => ({
      sheet: {
        ...state.sheet,
        questions: [
          ...state.sheet.questions,
          { ...question, _id: crypto.randomUUID() },
        ],
      },
    })),

  editQuestion: (id, newTitle) =>
    set((state) => ({
      sheet: {
        ...state.sheet,
        questions: state.sheet.questions.map((q) =>
          q._id === id ? { ...q, title: newTitle } : q
        ),
      },
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      sheet: {
        ...state.sheet,
        questions: state.sheet.questions.filter((q) => q._id !== id),
      },
    })),

  toggleSolved: (id) =>
    set((state) => ({
      sheet: {
        ...state.sheet,
        questions: state.sheet.questions.map((q) =>
          q._id === id ? { ...q, isSolved: !q.isSolved } : q
        ),
      },
    })),


  /* ================= DRAG & DROP ================= */

  reorderTopics: (startIndex, endIndex) =>
    set((state) => {
      const topics = [...state.sheet.sheet.config.topicOrder]

      const [removed] = topics.splice(startIndex, 1)
      topics.splice(endIndex, 0, removed)

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...state.sheet.sheet.config,
              topicOrder: topics,
            },
          },
        },
      }
    }),

  reorderSubTopics: (topic, startIndex, endIndex) =>
    set((state) => {
      const config = state.sheet.sheet.config

      const current =
        config.subTopicOrder?.[topic] ||
        Object.keys(
          state.sheet.questions
            .filter((q) => q.topic === topic)
            .reduce((acc, q) => {
              acc[q.subTopic] = true
              return acc
            }, {})
        )

      const items = [...current]
      const [removed] = items.splice(startIndex, 1)
      items.splice(endIndex, 0, removed)

      return {
        sheet: {
          ...state.sheet,
          sheet: {
            ...state.sheet.sheet,
            config: {
              ...config,
              subTopicOrder: {
                ...config.subTopicOrder,
                [topic]: items,
              },
            },
          },
        },
      }
    }),

  reorderQuestions: (topic, subTopic, startIndex, endIndex) =>
  set((state) => {
    const key = `${topic}::${subTopic}`
    const config = state.sheet.sheet.config

    const existing =
      config.questionOrder?.[key] ||
      state.sheet.questions
        .filter(
          (q) =>
            q.topic === topic &&
            (q.subTopic || "General") === subTopic &&
            !q.isPlaceholder
        )
        .map((q) => q._id)

    const items = [...existing]
    const [removed] = items.splice(startIndex, 1)
    items.splice(endIndex, 0, removed)

    return {
      sheet: {
        ...state.sheet,
        sheet: {
          ...state.sheet.sheet,
          config: {
            ...config,
            questionOrder: {
              ...config.questionOrder,
              [key]: items,
            },
          },
        },
      },
    }
  }),

}))
