<template>
  <v-card class="question-step" elevation="2" rounded="xl">
    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">
        {{ question.text }}
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-card
        v-for="(answer, i) in question.answers"
        :key="answer.id"
        class="mb-3 answer-option"
        :class="answerCardClass(answer.id)"
        :data-testid="`answer-option-${i}`"
        :disabled="!!feedbackResult"
        rounded="lg"
        :variant="answerVariant(answer.id)"
        @click="selectAnswer(answer.id)"
      >
        <v-card-text class="d-flex align-center">
          <span class="text-body-1">{{ answer.text }}</span>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="feedbackResult?.correct"
        class="mt-4"
        data-testid="feedback-correct"
        density="compact"
        type="success"
        variant="tonal"
      >
        Correct!
      </v-alert>

      <v-alert
        v-if="feedbackResult && !feedbackResult.correct"
        class="mt-4"
        data-testid="feedback-incorrect"
        density="compact"
        type="error"
        variant="tonal"
      >
        Incorrect
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        v-if="!feedbackResult"
        color="secondary"
        data-testid="confirm-btn"
        :disabled="!selectedId"
        variant="flat"
        @click="confirm"
      >
        Confirm
      </v-btn>

      <v-btn
        v-if="feedbackResult"
        color="primary"
        data-testid="next-btn"
        variant="flat"
        @click="$emit('next')"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { SubmitResult } from '@/composables/useQuizPlayer'
  import type { Question } from '@/types/quiz'
  import { ref } from 'vue'

  const props = defineProps<{
    question: Question
    feedbackResult?: SubmitResult
    selectedAnswerId?: string
  }>()

  const emit = defineEmits<{
    answer: [answerId: string]
    next: []
  }>()

  const selectedId = ref<string | null>(null)

  function selectAnswer (answerId: string) {
    if (props.feedbackResult) return
    selectedId.value = answerId
  }

  function confirm () {
    if (!selectedId.value) return
    emit('answer', selectedId.value)
  }

  function answerCardClass (answerId: string): Record<string, boolean> {
    if (props.feedbackResult) {
      return {
        'bg-success': answerId === props.feedbackResult.correctAnswerId,
        'bg-error':
          !props.feedbackResult.correct
          && answerId === props.selectedAnswerId
          && answerId !== props.feedbackResult.correctAnswerId,
      }
    }
    return {
      'bg-primary': selectedId.value === answerId,
    }
  }

  function answerVariant (answerId: string): 'flat' | 'outlined' {
    if (props.feedbackResult && (
      answerId === props.feedbackResult.correctAnswerId
      || answerId === props.selectedAnswerId
    )) {
      return 'flat'
    }
    if (selectedId.value === answerId) return 'flat'
    return 'outlined'
  }
</script>
