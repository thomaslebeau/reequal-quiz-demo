<template>
  <v-card class="quiz-card pa-6" elevation="0" rounded="lg">
    <v-card-text>
      <div class="d-flex align-start ga-4 mb-4">
        <v-avatar
          class="quiz-card__icon"
          color="secondary"
          rounded="lg"
          size="52"
          variant="flat"
        >
          <v-icon color="on-secondary" icon="mdi-clipboard-text-outline" size="28" />
        </v-avatar>

        <div class="flex-grow-1">
          <div class="text-h6 font-weight-bold mb-1">{{ quiz.title }}</div>
          <div class="text-body-2 text-medium-emphasis">Updated {{ formattedDate }}</div>
        </div>
      </div>

      <v-chip color="primary" size="small" variant="tonal">
        {{ quiz.questions.length }} {{ quiz.questions.length === 1 ? 'question' : 'questions' }}
      </v-chip>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-4 ga-2">
      <v-btn
        color="primary"
        data-testid="edit-btn"
        prepend-icon="mdi-pencil-outline"
        size="small"
        variant="tonal"
        @click="$emit('edit', quiz.id)"
      >
        Edit
      </v-btn>

      <v-btn
        color="error"
        data-testid="delete-btn"
        prepend-icon="mdi-delete-outline"
        size="small"
        variant="text"
        @click="$emit('delete', quiz.id)"
      >
        Delete
      </v-btn>

      <v-spacer />

      <v-btn
        color="secondary"
        data-testid="play-btn"
        prepend-icon="mdi-play"
        variant="flat"
        @click="$emit('play', quiz.id)"
      >
        Play
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { Quiz } from '@/types/quiz'
  import { computed } from 'vue'

  const props = defineProps<{
    quiz: Quiz
  }>()

  defineEmits<{
    edit: [id: string]
    delete: [id: string]
    play: [id: string]
  }>()

  const formattedDate = computed(() =>
    props.quiz.updatedAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  )
</script>

<style scoped>
  .quiz-card {
    box-shadow: 0 2px 12px rgba(var(--v-theme-primary), 0.08);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .quiz-card:hover {
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.14);
    transform: translateY(-2px);
  }

  .quiz-card__icon {
    opacity: 0.9;
  }
</style>
