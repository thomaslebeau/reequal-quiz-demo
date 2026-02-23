<template>
  <v-card class="score-screen text-center pa-6">
    <v-card-title class="text-h4">Your Score</v-card-title>
    <v-card-text class="text-h2 font-weight-bold text-primary">
      {{ score }} / {{ total }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  score: number
  total: number
}>()
</script>
