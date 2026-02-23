<template>
  <v-container>
    <h1 class="text-h4 mb-6">{{ id ? 'Edit Quiz' : 'New Quiz' }}</h1>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: string
}>()
</script>
