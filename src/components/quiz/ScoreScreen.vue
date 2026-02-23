<template>
  <v-card class="score-screen text-center" elevation="2">
    <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">
        Your Score
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-progress-circular
        :color="progressColor"
        data-testid="score-progress"
        :model-value="percentage"
        :size="120"
        :width="10"
      >
        <span class="text-h5 font-weight-bold">{{ percentage }}%</span>
      </v-progress-circular>

      <div class="text-h6 mt-4">
        {{ score }} / {{ total }}
      </div>

      <v-alert
        class="mt-4"
        data-testid="result-message"
        density="compact"
        :type="isPassing ? 'success' : 'info'"
        variant="tonal"
      >
        {{ isPassing ? 'Great job!' : 'Keep practicing!' }}
      </v-alert>
    </v-card-text>

    <v-divider class="mx-4" />

    <v-card-text>
      <div class="text-subtitle-1 font-weight-bold text-left mb-2">
        Recap
      </div>

      <v-card
        v-for="(result, i) in results"
        :key="i"
        class="mb-2 text-left"
        :data-testid="`recap-item-${i}`"
        rounded="lg"
        variant="tonal"
      >
        <v-card-text class="d-flex align-center ga-3 py-2">
          <v-icon
            v-if="result.correct"
            color="success"
            data-testid="recap-icon-correct"
            icon="mdi-check-circle"
          />
          <v-icon
            v-else
            color="error"
            data-testid="recap-icon-incorrect"
            icon="mdi-close-circle"
          />

          <div>
            <div class="font-weight-bold">{{ result.questionText }}</div>
            <div v-if="!result.correct" class="text-caption">
              Your answer: {{ result.selectedAnswerText }} — Correct: {{ result.correctAnswerText }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>

    <v-card-actions class="justify-center pb-4">
      <v-btn
        color="secondary"
        data-testid="play-again-btn"
        prepend-icon="mdi-replay"
        size="large"
        variant="flat"
        @click="$emit('restart')"
      >
        Play again
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { QuestionResult } from '@/types/quiz'
  import { computed } from 'vue'

  const props = defineProps<{
    score: number
    total: number
    results: QuestionResult[]
  }>()

  defineEmits<{
    restart: []
  }>()

  const percentage = computed(() =>
    props.total > 0 ? Math.round((props.score / props.total) * 100) : 0,
  )

  const isPassing = computed(() => percentage.value >= 70)

  const progressColor = computed(() =>
    isPassing.value ? 'success' : 'warning',
  )
</script>
