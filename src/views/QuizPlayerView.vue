<template>
  <v-container>
    <div class="d-flex align-center ga-2 mb-6">
      <v-btn
        aria-label="Back to quiz list"
        data-testid="back-btn"
        icon="mdi-arrow-left"
        variant="text"
        @click="router.push({ name: 'quiz-list' })"
      />
      <h1 class="text-h4 font-weight-bold">Quiz Player</h1>
    </div>

    <div v-if="!quiz" class="text-center py-12">
      <v-icon class="mb-4" color="warning" icon="mdi-alert-circle-outline" size="64" />
      <div class="text-h6">Quiz not found</div>
    </div>

    <QuizPlayer
      v-else
      :quiz="quiz"
      @restart="router.push({ name: 'quiz-list' })"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import QuizPlayer from '@/components/quiz/QuizPlayer.vue'
  import { useQuizStore } from '@/stores/quizStore'

  const props = defineProps<{
    id: string
  }>()

  const router = useRouter()
  const store = useQuizStore()

  const quiz = computed(() => store.getQuizById(props.id))
</script>
