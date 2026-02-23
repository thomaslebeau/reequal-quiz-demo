import type { Quiz } from '@/types/quiz'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])

  const quizCount = computed(() => quizzes.value.length)

  function getQuizById (id: string): Quiz | undefined {
    return quizzes.value.find(q => q.id === id)
  }

  function addQuiz (quiz: Quiz): void {
    quizzes.value.push(quiz)
  }

  function updateQuiz (updated: Quiz): void {
    const index = quizzes.value.findIndex(q => q.id === updated.id)
    if (index !== -1) {
      quizzes.value[index] = updated
    }
  }

  function deleteQuiz (id: string): void {
    quizzes.value = quizzes.value.filter(q => q.id !== id)
  }

  return {
    quizzes,
    quizCount,
    getQuizById,
    addQuiz,
    updateQuiz,
    deleteQuiz,
  }
})
