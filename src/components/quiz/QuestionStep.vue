<template>
  <v-card class="question-step pa-6" elevation="2">
    <v-card-item class="pb-2">
      <v-card-title class="text-h6 font-weight-bold">
        {{ question.text }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="px-6 pt-4 pb-2">
      <div ref="answersRef">
        <v-card
          v-for="(answer, i) in question.answers"
          :key="answer.id"
          :aria-label="answer.text"
          :aria-selected="selectedId === answer.id"
          class="mb-3 answer-option"
          :class="answerCardClass(answer.id)"
          :data-testid="`answer-option-${i}`"
          :disabled="!!feedbackResult"
          role="button"
          rounded="lg"
          :tabindex="feedbackResult ? -1 : 0"
          :variant="answerVariant(answer.id)"
          @click="selectAnswer(answer.id)"
          @keydown.enter="selectAnswer(answer.id)"
          @keydown.space.prevent="selectAnswer(answer.id)"
        >
          <v-card-text class="d-flex align-center">
            <span class="text-body-1">{{ answer.text }}</span>
          </v-card-text>
        </v-card>
      </div>

      <v-alert
        v-if="feedbackResult?.correct"
        aria-live="polite"
        class="mt-4"
        data-testid="feedback-correct"
        density="compact"
        type="success"
        variant="tonal"
      >
        Correct!
      </v-alert>

      <v-alert
        v-if="feedbackResult && !feedbackResult.correct"
        aria-live="polite"
        class="mt-4"
        data-testid="feedback-incorrect"
        density="compact"
        type="error"
        variant="tonal"
      >
        Incorrect
      </v-alert>
    </v-card-text>

    <v-card-actions class="px-6 pb-6">
      <v-spacer />

      <v-btn
        v-if="!feedbackResult"
        color="secondary"
        data-testid="confirm-btn"
        :disabled="!selectedId"
        variant="flat"
        @click="confirm"
      >
        Confirm
      </v-btn>

      <v-btn
        v-if="feedbackResult"
        color="primary"
        data-testid="next-btn"
        variant="flat"
        @click="$emit('next')"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { SubmitResult } from '@/composables/useQuizPlayer'
  import type { Question } from '@/types/quiz'
  import { nextTick, onMounted, ref, watch } from 'vue'
  import { getGsap } from '@/composables/useGsap'

  const props = defineProps<{
    question: Question
    feedbackResult?: SubmitResult
    selectedAnswerId?: string
  }>()

  const emit = defineEmits<{
    answer: [answerId: string]
    next: []
  }>()

  const selectedId = ref<string | null>(null)
  const answersRef = ref<HTMLElement | null>(null)

  function selectAnswer (answerId: string) {
    if (props.feedbackResult) return
    selectedId.value = answerId
  }

  function confirm () {
    if (!selectedId.value) return
    emit('answer', selectedId.value)
  }

  function answerCardClass (answerId: string): Record<string, boolean> {
    if (props.feedbackResult) {
      return {
        'bg-success': answerId === props.feedbackResult.correctAnswerId,
        'bg-error':
          !props.feedbackResult.correct
          && answerId === props.selectedAnswerId
          && answerId !== props.feedbackResult.correctAnswerId,
      }
    }
    return {
      'bg-primary': selectedId.value === answerId,
    }
  }

  async function animateAnswersIn () {
    await nextTick()
    const gsap = await getGsap()
    if (!gsap || !answersRef.value) return
    const cards = answersRef.value.querySelectorAll('.answer-option')
    if (cards.length === 0) return
    gsap.from(cards, { scale: 0, opacity: 0, stagger: 0.08, duration: 0.4, ease: 'back.out(1.4)' })
  }

  onMounted(animateAnswersIn)
  watch(() => props.question.id, animateAnswersIn)

  watch(() => props.feedbackResult, async result => {
    if (!result) return
    const gsap = await getGsap()
    if (!gsap || !answersRef.value) return

    const selectedIdx = props.question.answers.findIndex(a => a.id === props.selectedAnswerId)
    const cards = answersRef.value.querySelectorAll('.answer-option')
    const selectedCard = cards[selectedIdx]
    if (!selectedCard) return

    if (result.correct) {
      gsap.fromTo(selectedCard, { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 2, duration: 0.15, ease: 'power1.inOut' })
      spawnConfetti(gsap, selectedCard as HTMLElement)
    } else {
      gsap.fromTo(selectedCard, { x: 0 }, { x: 10, yoyo: true, repeat: 4, duration: 0.08, ease: 'power1.inOut' })
    }
  })

  function spawnConfetti (gsap: NonNullable<Awaited<ReturnType<typeof getGsap>>>, origin: HTMLElement) {
    const rect = origin.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const style = getComputedStyle(document.documentElement)
    const colors = [
      `rgb(${style.getPropertyValue('--v-theme-secondary')})`,
      `rgb(${style.getPropertyValue('--v-theme-primary')})`,
      `rgb(${style.getPropertyValue('--v-theme-success')})`,
      `rgb(${style.getPropertyValue('--v-theme-error')})`,
      `rgb(${style.getPropertyValue('--v-theme-info')})`,
      `rgb(${style.getPropertyValue('--v-theme-warning')})`,
    ]
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div')
      Object.assign(dot.style, {
        position: 'fixed',
        left: `${cx}px`,
        top: `${cy}px`,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: colors[i % colors.length],
        zIndex: '9999',
        pointerEvents: 'none',
      })
      document.body.append(dot)
      const angle = (Math.PI * 2 * i) / 12
      const dist = 60 + Math.random() * 40
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      })
    }
  }

  function answerVariant (answerId: string): 'flat' | 'outlined' {
    if (props.feedbackResult) return 'flat'
    if (selectedId.value === answerId) return 'flat'
    return 'outlined'
  }
</script>
