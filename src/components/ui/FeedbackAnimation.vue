<template>
  <div class="feedback-animation">
    <div
      v-if="visible"
      class="d-flex flex-column align-center"
      :class="correct ? 'feedback-correct' : 'feedback-incorrect'"
      data-testid="feedback-content"
    >
      <v-icon
        class="mb-2"
        :color="correct ? 'success' : 'error'"
        data-testid="feedback-icon"
        :icon="correct ? 'mdi-check-circle' : 'mdi-close-circle'"
        size="64"
      />
      <span class="text-h6 font-weight-bold" :class="correct ? 'text-success' : 'text-error'">
        {{ correct ? 'Correct!' : 'Incorrect' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    correct: boolean
    visible: boolean
  }>()
</script>

<style scoped>
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.feedback-correct {
  animation: pulse 0.5s ease;
}

.feedback-incorrect {
  animation: shake 0.4s ease;
}
</style>
