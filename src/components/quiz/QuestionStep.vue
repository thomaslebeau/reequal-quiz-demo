<template>
  <v-card class="question-step">
    <v-card-title>{{ question.text }}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import type { Question } from '@/types/quiz'

defineProps<{
  question: Question
}>()
</script>
