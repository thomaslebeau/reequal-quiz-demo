<template>
  <v-card rounded="xl" elevation="1" class="question-editor">
    <v-card-item>
      <template #prepend>
        <v-avatar color="secondary" variant="tonal" size="36">
          <span class="text-body-1 font-weight-bold">{{ index + 1 }}</span>
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Question {{ index + 1 }}
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-text-field
        data-testid="question-text"
        :model-value="question.text"
        label="Question text"
        :error-messages="questionTextError"
        @update:model-value="updateQuestionText"
      />

      <div
        v-for="(answer, i) in question.answers"
        :key="answer.id"
        class="d-flex align-center ga-2 mb-2"
      >
        <v-checkbox
          :data-testid="`correct-toggle-${i}`"
          :model-value="answer.isCorrect"
          color="success"
          hide-details
          density="compact"
          @update:model-value="toggleCorrect(i)"
        />

        <v-text-field
          :data-testid="`answer-text-${i}`"
          :model-value="answer.text"
          :label="`Answer ${i + 1}`"
          density="compact"
          hide-details
          @update:model-value="updateAnswerText(i, $event as string)"
        />

        <v-btn
          :data-testid="`remove-answer-${i}`"
          icon="mdi-close"
          variant="text"
          color="error"
          size="small"
          :disabled="question.answers.length <= 2"
          @click="removeAnswer(i)"
        />
      </div>

      <v-alert
        v-if="!hasCorrectAnswer"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-2"
      >
        Mark one answer as correct
      </v-alert>

      <v-btn
        data-testid="add-answer-btn"
        variant="tonal"
        color="primary"
        size="small"
        prepend-icon="mdi-plus"
        class="mt-2"
        :disabled="question.answers.length >= 4"
        @click="addAnswer"
      >
        Add answer
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '@/types/quiz'

const props = defineProps<{
  question: Question
  index: number
}>()

const emit = defineEmits<{
  'update:question': [question: Question]
}>()

const hasCorrectAnswer = computed(() =>
  props.question.answers.some(a => a.isCorrect),
)

const questionTextError = computed(() =>
  props.question.text ? '' : 'Question text is required',
)

function emitUpdate(patch: Partial<Question>) {
  emit('update:question', { ...props.question, ...patch })
}

function updateQuestionText(text: string) {
  emitUpdate({ text })
}

function updateAnswerText(index: number, text: string) {
  const answers = props.question.answers.map((a, i) =>
    i === index ? { ...a, text } : a,
  )
  emitUpdate({ answers })
}

function toggleCorrect(index: number) {
  const answers = props.question.answers.map((a, i) => ({
    ...a,
    isCorrect: i === index,
  }))
  emitUpdate({ answers })
}

function addAnswer() {
  const answers = [
    ...props.question.answers,
    { id: crypto.randomUUID(), text: '', isCorrect: false },
  ]
  emitUpdate({ answers })
}

function removeAnswer(index: number) {
  const answers = props.question.answers.filter((_, i) => i !== index)
  emitUpdate({ answers })
}
</script>
