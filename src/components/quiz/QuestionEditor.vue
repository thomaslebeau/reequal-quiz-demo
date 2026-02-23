<template>
  <v-card class="question-editor">
    <v-card-title>Question {{ index + 1 }}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  index: number
}>()
</script>
