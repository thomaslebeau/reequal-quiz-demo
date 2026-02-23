import { ref, computed } from 'vue'
import type { Quiz } from '@/types/quiz'

export function useQuizPlayer(quiz: Quiz) {
  const currentIndex = ref(0)
  const answers = ref<Map<string, string>>(new Map())

  const currentQuestion = computed(() => quiz.questions[currentIndex.value])
  const isLastQuestion = computed(() => currentIndex.value === quiz.questions.length - 1)
  const isFinished = computed(() => currentIndex.value >= quiz.questions.length)
  const progress = computed(() =>
    quiz.questions.length > 0
      ? ((currentIndex.value) / quiz.questions.length) * 100
      : 0
  )

  const score = computed(() => {
    let correct = 0
    for (const question of quiz.questions) {
      const selectedId = answers.value.get(question.id)
      const correctAnswer = question.answers.find(a => a.isCorrect)
      if (selectedId && correctAnswer && selectedId === correctAnswer.id) {
        correct++
      }
    }
    return correct
  })

  function selectAnswer(questionId: string, answerId: string): void {
    answers.value.set(questionId, answerId)
  }

  function nextQuestion(): void {
    if (currentIndex.value < quiz.questions.length) {
      currentIndex.value++
    }
  }

  function reset(): void {
    currentIndex.value = 0
    answers.value = new Map()
  }

  return {
    currentIndex,
    currentQuestion,
    isLastQuestion,
    isFinished,
    progress,
    score,
    selectAnswer,
    nextQuestion,
    reset,
  }
}
