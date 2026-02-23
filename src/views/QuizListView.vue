<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Quizzes</h1>

      <v-btn
        data-testid="create-quiz-btn"
        color="secondary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="router.push({ name: 'quiz-create' })"
      >
        New quiz
      </v-btn>
    </div>

    <v-text-field
      data-testid="search-input"
      v-model="search"
      label="Search quizzes"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      class="mb-6"
    />

    <div v-if="filteredQuizzes.length === 0" data-testid="empty-state" class="text-center py-12">
      <v-icon icon="mdi-clipboard-text-outline" size="64" color="primary" class="mb-4" />
      <div class="text-h6">No quizzes yet</div>
      <div class="text-body-2 text-medium-emphasis">Create your first quiz to get started</div>
    </div>

    <div v-else class="d-flex flex-column ga-4">
      <QuizCard
        v-for="quiz in filteredQuizzes"
        :key="quiz.id"
        :data-testid="`quiz-card-${quiz.id}`"
        :quiz="quiz"
        @edit="onEdit"
        @delete="onDelete"
        @play="onPlay"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'
import QuizCard from '@/components/quiz/QuizCard.vue'

const router = useRouter()
const store = useQuizStore()

const search = ref('')

const filteredQuizzes = computed(() => {
  const term = search.value.toLowerCase().trim()
  if (!term) return store.quizzes
  return store.quizzes.filter(q =>
    q.title.toLowerCase().includes(term),
  )
})

function onEdit(id: string) {
  router.push({ name: 'quiz-edit', params: { id } })
}

function onDelete(id: string) {
  store.deleteQuiz(id)
}

function onPlay(id: string) {
  router.push({ name: 'quiz-play', params: { id } })
}
</script>
