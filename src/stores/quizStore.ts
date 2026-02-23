import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quiz } from '@/types/quiz'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])

  const quizCount = computed(() => 0)

  function getQuizById(id: string): Quiz | undefined {
    return undefined
  }

  function addQuiz(quiz: Quiz): void {
    // not implemented
  }

  function updateQuiz(updated: Quiz): void {
    // not implemented
  }

  function deleteQuiz(id: string): void {
    // not implemented
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
