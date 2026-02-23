import { ref, computed } from 'vue'
import type { Quiz } from '@/types/quiz'

export interface SubmitResult {
  correct: boolean
  correctAnswerId: string
}

export function useQuizPlayer(quiz: Quiz) {
  const currentIndex = ref(0)
  const selectedAnswerId = ref<string | null>(null)
  const score = ref(0)

  const currentQuestion = computed(() => quiz.questions[currentIndex.value])
  const totalQuestions = computed(() => quiz.questions.length)
  const isComplete = computed(() => currentIndex.value >= quiz.questions.length)
  const progress = computed(() =>
    quiz.questions.length > 0
      ? (currentIndex.value / quiz.questions.length) * 100
      : 0,
  )

  function selectAnswer(answerId: string): void {
    selectedAnswerId.value = answerId
  }

  function submitAnswer(): SubmitResult {
    const question = currentQuestion.value
    const correctAnswer = question.answers.find(a => a.isCorrect)
    const isCorrect = selectedAnswerId.value === correctAnswer?.id

    if (isCorrect) {
      score.value++
    }

    selectedAnswerId.value = null

    return {
      correct: isCorrect,
      correctAnswerId: correctAnswer?.id ?? '',
    }
  }

  function nextQuestion(): void {
    if (currentIndex.value < quiz.questions.length) {
      currentIndex.value++
    }
  }

  function reset(): void {
    currentIndex.value = 0
    selectedAnswerId.value = null
    score.value = 0
  }

  return {
    currentIndex,
    currentQuestion,
    progress,
    score: computed(() => score.value),
    totalQuestions,
    isComplete,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    reset,
  }
}
