<template>
  <v-container>
    <div class="d-flex align-center ga-2 mb-6">
      <v-btn
        data-testid="back-btn"
        icon="mdi-arrow-left"
        variant="text"
        @click="router.push({ name: 'quiz-list' })"
      />
      <h1 class="text-h4 font-weight-bold">
        {{ id ? 'Edit Quiz' : 'New Quiz' }}
      </h1>
    </div>

    <div v-if="id && !quiz" class="text-center py-12">
      <v-icon class="mb-4" color="warning" icon="mdi-alert-circle-outline" size="64" />
      <div class="text-h6">Quiz not found</div>
    </div>

    <QuizForm
      v-else
      data-testid="quiz-form"
      :quiz="quiz"
      @save="handleSave"
    />
  </v-container>
</template>

<script setup lang="ts">
  import type { Quiz } from '@/types/quiz'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import QuizForm from '@/components/quiz/QuizForm.vue'
  import { useQuizStore } from '@/stores/quizStore'

  const props = defineProps<{
    id?: string
  }>()

  const router = useRouter()
  const store = useQuizStore()

  const quiz = computed(() =>
    props.id ? store.getQuizById(props.id) : undefined,
  )

  function handleSave (saved: Quiz) {
    if (props.id && store.getQuizById(props.id)) {
      store.updateQuiz(saved)
    } else {
      store.addQuiz(saved)
    }
    router.push({ name: 'quiz-list' })
  }
</script>
