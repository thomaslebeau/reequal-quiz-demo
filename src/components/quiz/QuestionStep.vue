<template>
  <v-card rounded="xl" elevation="2" class="question-step">
    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">
        {{ question.text }}
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-card
        v-for="(answer, i) in question.answers"
        :key="answer.id"
        :data-testid="`answer-option-${i}`"
        class="mb-3 answer-option"
        :class="answerCardClass(answer.id)"
        rounded="lg"
        :variant="answerVariant(answer.id)"
        :disabled="!!feedbackResult"
        @click="selectAnswer(answer.id)"
      >
        <v-card-text class="d-flex align-center">
          <span class="text-body-1">{{ answer.text }}</span>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="feedbackResult?.correct"
        data-testid="feedback-correct"
        type="success"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Correct!
      </v-alert>

      <v-alert
        v-if="feedbackResult && !feedbackResult.correct"
        data-testid="feedback-incorrect"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Incorrect
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        v-if="!feedbackResult"
        data-testid="confirm-btn"
        color="secondary"
        variant="flat"
        :disabled="!selectedId"
        @click="confirm"
      >
        Confirm
      </v-btn>

      <v-btn
        v-if="feedbackResult"
        data-testid="next-btn"
        color="primary"
        variant="flat"
        @click="$emit('next')"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from '@/types/quiz'
import type { SubmitResult } from '@/composables/useQuizPlayer'

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

function selectAnswer(answerId: string) {
  if (props.feedbackResult) return
  selectedId.value = answerId
}

function confirm() {
  if (!selectedId.value) return
  emit('answer', selectedId.value)
}

function answerCardClass(answerId: string): Record<string, boolean> {
  if (props.feedbackResult) {
    return {
      'bg-success': answerId === props.feedbackResult.correctAnswerId,
      'bg-error':
        !props.feedbackResult.correct &&
        answerId === props.selectedAnswerId &&
        answerId !== props.feedbackResult.correctAnswerId,
    }
  }
  return {
    'bg-primary': selectedId.value === answerId,
  }
}

function answerVariant(answerId: string): 'flat' | 'outlined' {
  if (props.feedbackResult) {
    if (
      answerId === props.feedbackResult.correctAnswerId ||
      answerId === props.selectedAnswerId
    ) {
      return 'flat'
    }
  }
  if (selectedId.value === answerId) return 'flat'
  return 'outlined'
}
</script>
