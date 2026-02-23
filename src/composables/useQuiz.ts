import type { Answer, Question, Quiz } from '@/types/quiz'
import { useQuizStore } from '@/stores/quizStore'

export function useQuiz () {
  const store = useQuizStore()

  function createQuiz (title: string): Quiz {
    return {
      id: crypto.randomUUID(),
      title,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  function createQuestion (text: string): Question {
    return {
      id: crypto.randomUUID(),
      text,
      answers: [],
    }
  }

  function createAnswer (text: string, isCorrect = false): Answer {
    return {
      id: crypto.randomUUID(),
      text,
      isCorrect,
    }
  }

  function saveQuiz (quiz: Quiz): void {
    store.addQuiz(quiz)
  }

  function removeQuiz (id: string): void {
    store.deleteQuiz(id)
  }

  return {
    quizzes: store.quizzes,
    quizCount: store.quizCount,
    getQuizById: store.getQuizById,
    createQuiz,
    createQuestion,
    createAnswer,
    saveQuiz,
    removeQuiz,
  }
}
