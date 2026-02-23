<template>
  <div class="progress-path">
    <v-progress-linear
      :model-value="progress"
      color="secondary"
      height="12"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>
