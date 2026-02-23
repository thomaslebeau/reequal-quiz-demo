<template>
  <v-card rounded="xl" class="quiz-card" elevation="2">
    <v-card-item>
      <template #prepend>
        <v-avatar color="primary" variant="tonal" size="48">
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
      <v-chip color="primary" variant="tonal" size="small">
        {{ quiz.questions.length }} {{ quiz.questions.length === 1 ? 'question' : 'questions' }}
      </v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn
        data-testid="edit-btn"
        variant="text"
        color="primary"
        prepend-icon="mdi-pencil-outline"
        @click="$emit('edit', quiz.id)"
      >
        Edit
      </v-btn>

      <v-btn
        data-testid="delete-btn"
        variant="text"
        color="error"
        prepend-icon="mdi-delete-outline"
        @click="$emit('delete', quiz.id)"
      >
        Delete
      </v-btn>

      <v-spacer />

      <v-btn
        data-testid="play-btn"
        variant="flat"
        color="secondary"
        prepend-icon="mdi-play"
        @click="$emit('play', quiz.id)"
      >
        Play
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Quiz } from '@/types/quiz'

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
