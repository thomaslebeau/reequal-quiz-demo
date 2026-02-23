import { useQuizStore } from '@/stores/quizStore'
import type { Quiz, Question, Answer } from '@/types/quiz'

export function useQuiz() {
  const store = useQuizStore()

  function createQuiz(title: string): Quiz {
    const quiz: Quiz = {
      id: crypto.randomUUID(),
      title,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    store.addQuiz(quiz)
    return quiz
  }

  function createQuestion(text: string): Question {
    return {
      id: crypto.randomUUID(),
      text,
      answers: [],
    }
  }

  function createAnswer(text: string, isCorrect = false): Answer {
    return {
      id: crypto.randomUUID(),
      text,
      isCorrect,
    }
  }

  return {
    quizzes: store.quizzes,
    quizCount: store.quizCount,
    getQuizById: store.getQuizById,
    createQuiz,
    createQuestion,
    createAnswer,
    updateQuiz: store.updateQuiz,
    deleteQuiz: store.deleteQuiz,
  }
}
