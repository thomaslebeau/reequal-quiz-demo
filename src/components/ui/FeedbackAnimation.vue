<template>
  <v-fade-transition>
    <div v-if="visible" :class="['feedback-animation', correct ? 'correct' : 'incorrect']">
      <v-icon :color="correct ? 'success' : 'error'" size="64">
        {{ correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </div>
  </v-fade-transition>
</template>

<script setup lang="ts">
defineProps<{
  correct: boolean
  visible: boolean
}>()
</script>
