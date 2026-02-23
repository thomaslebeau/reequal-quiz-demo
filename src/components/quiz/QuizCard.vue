<template>
  <v-card class="quiz-card" elevation="2" rounded="xl">
    <v-card-item>
      <template #prepend>
        <v-avatar color="primary" size="48" variant="tonal">
          <v-icon icon="mdi-clipboard-text-outline" />
        </v-avatar>
      </template>

      <v-card-title class="text-h6 font-weight-bold">
        {{ quiz.title }}
      </v-card-title>

      <v-card-subtitle>
        Updated {{ formattedDate }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-chip color="primary" size="small" variant="tonal">
        {{ quiz.questions.length }} {{ quiz.questions.length === 1 ? 'question' : 'questions' }}
      </v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        data-testid="edit-btn"
        prepend-icon="mdi-pencil-outline"
        variant="text"
        @click="$emit('edit', quiz.id)"
      >
        Edit
      </v-btn>

      <v-btn
        color="error"
        data-testid="delete-btn"
        prepend-icon="mdi-delete-outline"
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
