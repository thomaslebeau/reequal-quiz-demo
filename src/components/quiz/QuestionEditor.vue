<template>
  <v-card class="question-editor" elevation="0">
    <v-card-item class="pb-0">
      <template #prepend>
        <v-avatar color="secondary" size="40" variant="flat">
          <span class="text-body-1 font-weight-bold text-white">{{ index + 1 }}</span>
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Question {{ index + 1 }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="pt-4">
      <v-text-field
        data-testid="question-text"
        :error-messages="questionTextError"
        label="Question text"
        :model-value="question.text"
        variant="filled"
        @update:model-value="updateQuestionText"
      />

      <div
        v-for="(answer, i) in question.answers"
        :key="answer.id"
        class="d-flex align-center ga-3 mb-3"
      >
        <v-checkbox
          color="success"
          :data-testid="`correct-toggle-${i}`"
          density="compact"
          hide-details
          :model-value="answer.isCorrect"
          @update:model-value="toggleCorrect(i)"
        />

        <v-text-field
          :data-testid="`answer-text-${i}`"
          density="comfortable"
          hide-details
          :label="`Answer ${i + 1}`"
          :model-value="answer.text"
          variant="filled"
          @update:model-value="updateAnswerText(i, $event as string)"
        />

        <v-btn
          color="error"
          :data-testid="`remove-answer-${i}`"
          :disabled="question.answers.length <= 2"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="removeAnswer(i)"
        />
      </div>

      <v-alert
        v-if="!hasCorrectAnswer"
        class="mt-2"
        density="compact"
        type="warning"
        variant="tonal"
      >
        Mark one answer as correct
      </v-alert>

      <v-btn
        class="mt-3"
        color="primary"
        data-testid="add-answer-btn"
        :disabled="question.answers.length >= 4"
        prepend-icon="mdi-plus"
        size="small"
        variant="tonal"
        @click="addAnswer"
      >
        Add answer
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { Question } from '@/types/quiz'
  import { computed } from 'vue'

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

  function emitUpdate (patch: Partial<Question>) {
    emit('update:question', { ...props.question, ...patch })
  }

  function updateQuestionText (text: string) {
    emitUpdate({ text })
  }

  function updateAnswerText (index: number, text: string) {
    const answers = props.question.answers.map((a, i) =>
      i === index ? { ...a, text } : a,
    )
    emitUpdate({ answers })
  }

  function toggleCorrect (index: number) {
    const answers = props.question.answers.map((a, i) => ({
      ...a,
      isCorrect: i === index,
    }))
    emitUpdate({ answers })
  }

  function addAnswer () {
    const answers = [
      ...props.question.answers,
      { id: crypto.randomUUID(), text: '', isCorrect: false },
    ]
    emitUpdate({ answers })
  }

  function removeAnswer (index: number) {
    const answers = props.question.answers.filter((_, i) => i !== index)
    emitUpdate({ answers })
  }
</script>

<style scoped>
  .question-editor {
    border: 1.5px solid rgb(var(--v-theme-primary), 0.1);
    padding: 16px;
  }
</style>
