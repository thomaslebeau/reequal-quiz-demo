<template>
  <v-card
    class="quiz-player"
    data-testid="quiz-player-card"
    elevation="2"
    rounded="xl"
  >
    <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">
        {{ quiz.title }}
      </v-card-title>
    </v-card-item>

    <template v-if="!player.isComplete.value">
      <v-card-text>
        <ProgressPath
          :current="player.currentIndex.value"
          data-testid="progress-path"
          :total="player.totalQuestions.value"
        />

        <div class="text-subtitle-1 text-center mt-2 mb-4">
          {{ player.currentIndex.value + 1 }} / {{ player.totalQuestions.value }}
        </div>

        <QuestionStep
          data-testid="question-step"
          :feedback-result="feedbackResult ?? undefined"
          :question="player.currentQuestion.value!"
          :selected-answer-id="lastSelectedAnswerId ?? undefined"
          @answer="handleAnswer"
          @next="handleNext"
        />
      </v-card-text>
    </template>

    <template v-else>
      <v-card-text>
        <ScoreScreen
          data-testid="score-screen"
          :results="questionResults"
          :score="player.score.value"
          :total="player.totalQuestions.value"
          @restart="handleRestart"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup lang="ts">
  import type { QuestionResult, Quiz } from '@/types/quiz'
  import { ref } from 'vue'
  import ProgressPath from '@/components/ui/ProgressPath.vue'
  import { type SubmitResult, useQuizPlayer } from '@/composables/useQuizPlayer'
  import QuestionStep from './QuestionStep.vue'
  import ScoreScreen from './ScoreScreen.vue'

  const props = defineProps<{
    quiz: Quiz
  }>()

  const emit = defineEmits<{
    restart: []
  }>()

  const player = useQuizPlayer(props.quiz)

  const feedbackResult = ref<SubmitResult | null>(null)
  const lastSelectedAnswerId = ref<string | null>(null)
  const questionResults = ref<QuestionResult[]>([])

  function handleAnswer (answerId: string) {
    lastSelectedAnswerId.value = answerId
    player.selectAnswer(answerId)

    const question = player.currentQuestion.value!
    const selectedAnswer = question.answers.find(a => a.id === answerId)
    const correctAnswer = question.answers.find(a => a.isCorrect)

    const result = player.submitAnswer()
    feedbackResult.value = result

    questionResults.value.push({
      questionText: question.text,
      correct: result.correct,
      selectedAnswerText: selectedAnswer?.text ?? '',
      correctAnswerText: correctAnswer?.text ?? '',
    })
  }

  function handleNext () {
    feedbackResult.value = null
    lastSelectedAnswerId.value = null
    player.nextQuestion()
  }

  function handleRestart () {
    feedbackResult.value = null
    lastSelectedAnswerId.value = null
    questionResults.value = []
    player.reset()
    emit('restart')
  }
</script>
