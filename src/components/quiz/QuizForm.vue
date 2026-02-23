<template>
  <v-form class="quiz-form" @submit.prevent="handleSave">
    <v-text-field
      data-testid="quiz-title"
      v-model="title"
      label="Quiz title"
      :error-messages="titleError"
    />

    <div
      v-for="(question, i) in questions"
      :key="question.id"
      class="mb-4"
    >
      <QuestionEditor
        :data-testid="`question-editor-${i}`"
        :question="question"
        :index="i"
        @update:question="updateQuestion(i, $event)"
      />

      <v-btn
        :data-testid="`remove-question-${i}`"
        variant="text"
        color="error"
        size="small"
        prepend-icon="mdi-close"
        class="mt-1"
        :disabled="questions.length <= 1"
        @click="removeQuestion(i)"
      >
        Remove question
      </v-btn>
    </div>

    <v-btn
      data-testid="add-question-btn"
      variant="tonal"
      color="primary"
      size="small"
      prepend-icon="mdi-plus"
      class="mb-4"
      @click="addQuestion"
    >
      Add question
    </v-btn>

    <v-alert
      v-if="validationError"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
    >
      {{ validationError }}
    </v-alert>

    <v-btn
      data-testid="save-btn"
      color="secondary"
      variant="flat"
      @click="handleSave"
    >
      Save quiz
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Quiz, Question } from '@/types/quiz'
import QuestionEditor from './QuestionEditor.vue'

const props = defineProps<{
  quiz?: Quiz
}>()

const emit = defineEmits<{
  save: [quiz: Quiz]
}>()

function makeEmptyQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    text: '',
    answers: [
      { id: crypto.randomUUID(), text: '', isCorrect: false },
      { id: crypto.randomUUID(), text: '', isCorrect: true },
    ],
  }
}

const title = ref(props.quiz?.title ?? '')
const questions = ref<Question[]>(
  props.quiz?.questions.map(q => ({ ...q })) ?? [makeEmptyQuestion()],
)
const validationError = ref('')
const titleError = ref('')

watch(
  () => props.quiz,
  (newQuiz) => {
    if (newQuiz) {
      title.value = newQuiz.title
      questions.value = newQuiz.questions.map(q => ({ ...q }))
    }
  },
)

function updateQuestion(index: number, updated: Question) {
  questions.value[index] = updated
}

function addQuestion() {
  questions.value.push(makeEmptyQuestion())
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1)
}

function validate(): boolean {
  validationError.value = ''
  titleError.value = ''

  if (!title.value.trim()) {
    titleError.value = 'Quiz title is required'
    validationError.value = 'Quiz title is required'
    return false
  }

  for (const question of questions.value) {
    if (!question.text.trim()) {
      validationError.value = 'Each question must have text'
      return false
    }

    if (!question.answers.some(a => a.isCorrect)) {
      validationError.value = 'Each question must have a correct answer'
      return false
    }
  }

  return true
}

function handleSave() {
  if (!validate()) return

  const quiz: Quiz = {
    id: props.quiz?.id ?? crypto.randomUUID(),
    title: title.value,
    questions: questions.value,
    createdAt: props.quiz?.createdAt ?? new Date(),
    updatedAt: new Date(),
  }

  emit('save', quiz)
}
</script>
