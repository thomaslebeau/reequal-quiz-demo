<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Quizzes</h1>

      <v-btn
        color="secondary"
        data-testid="create-quiz-btn"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="router.push({ name: 'quiz-create' })"
      >
        New quiz
      </v-btn>
    </div>

    <v-text-field
      v-model="search"
      class="mb-6"
      clearable
      data-testid="search-input"
      hide-details
      label="Search quizzes"
      prepend-inner-icon="mdi-magnify"
    />

    <div v-if="filteredQuizzes.length === 0" class="text-center py-12" data-testid="empty-state">
      <v-icon class="mb-4" color="primary" icon="mdi-clipboard-text-outline" size="64" />
      <div class="text-h6">No quizzes yet</div>
      <div class="text-body-2 text-medium-emphasis">Create your first quiz to get started</div>
    </div>

    <v-row v-else ref="cardRowRef">
      <v-col
        v-for="quiz in filteredQuizzes"
        :key="quiz.id"
        cols="12"
        lg="4"
        md="6"
      >
        <QuizCard
          :data-testid="`quiz-card-${quiz.id}`"
          :quiz="quiz"
          @delete="onDelete"
          @edit="onEdit"
          @play="onPlay"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import QuizCard from '@/components/quiz/QuizCard.vue'
  import { getGsap } from '@/composables/useGsap'
  import { useQuizStore } from '@/stores/quizStore'

  const router = useRouter()
  const store = useQuizStore()

  const search = ref('')
  const cardRowRef = ref<any>(null)

  const filteredQuizzes = computed(() => {
    const term = search.value.toLowerCase().trim()
    if (!term) return store.quizzes
    return store.quizzes.filter(q =>
      q.title.toLowerCase().includes(term),
    )
  })

  function onEdit (id: string) {
    router.push({ name: 'quiz-edit', params: { id } })
  }

  function onDelete (id: string) {
    store.deleteQuiz(id)
  }

  function onPlay (id: string) {
    router.push({ name: 'quiz-play', params: { id } })
  }

  async function animateCards () {
    await nextTick()
    const gsap = await getGsap()
    if (!gsap || !cardRowRef.value) return
    const el = cardRowRef.value.$el ?? cardRowRef.value
    const cols = el.querySelectorAll(':scope > .v-col')
    if (cols.length === 0) return
    gsap.from(cols, { opacity: 0, y: 40, stagger: 0.1, duration: 0.5, ease: 'power2.out' })
  }

  onMounted(animateCards)
  watch(filteredQuizzes, animateCards)
</script>
