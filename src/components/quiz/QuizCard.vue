<template>
  <v-card class="quiz-card">
    <v-card-title>{{ quiz.title }}</v-card-title>
    <v-card-subtitle>{{ quiz.questions.length }} questions</v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import type { Quiz } from '@/types/quiz'

defineProps<{
  quiz: Quiz
}>()
</script>
