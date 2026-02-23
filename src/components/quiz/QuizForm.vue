<template>
  <v-form class="quiz-form" @submit.prevent="handleSave">
    <v-text-field
      v-model="title"
      data-testid="quiz-title"
      :error-messages="titleError"
      label="Quiz title"
    />

    <div
      v-for="(question, i) in questions"
      :key="question.id"
      class="mb-4"
    >
      <QuestionEditor
        :data-testid="`question-editor-${i}`"
        :index="i"
        :question="question"
        @update:question="updateQuestion(i, $event)"
      />

      <v-btn
        class="mt-1"
        color="error"
        :data-testid="`remove-question-${i}`"
        :disabled="questions.length <= 1"
        prepend-icon="mdi-close"
        size="small"
        variant="text"
        @click="removeQuestion(i)"
      >
        Remove question
      </v-btn>
    </div>

    <v-btn
      class="mb-4"
      color="primary"
      data-testid="add-question-btn"
      prepend-icon="mdi-plus"
      size="small"
      variant="tonal"
      @click="addQuestion"
    >
      Add question
    </v-btn>

    <v-alert
      v-if="validationError"
      class="mb-4"
      density="compact"
      type="error"
      variant="tonal"
    >
      {{ validationError }}
    </v-alert>

    <v-btn
      color="secondary"
      data-testid="save-btn"
      variant="flat"
      @click="handleSave"
    >
      Save quiz
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
  import type { Question, Quiz } from '@/types/quiz'
  import { ref, watch } from 'vue'
  import QuestionEditor from './QuestionEditor.vue'

  const props = defineProps<{
    quiz?: Quiz
  }>()

  const emit = defineEmits<{
    save: [quiz: Quiz]
  }>()

  function makeEmptyQuestion (): Question {
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
    newQuiz => {
      if (newQuiz) {
        title.value = newQuiz.title
        questions.value = newQuiz.questions.map(q => ({ ...q }))
      }
    },
  )

  function updateQuestion (index: number, updated: Question) {
    questions.value[index] = updated
  }

  function addQuestion () {
    questions.value.push(makeEmptyQuestion())
  }

  function removeQuestion (index: number) {
    questions.value.splice(index, 1)
  }

  function validate (): boolean {
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

  function handleSave () {
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
