<template>
  <div class="feedback-animation">
    <div
      v-if="visible"
      ref="contentRef"
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
  import { nextTick, ref, watch } from 'vue'
  import { getGsap } from '@/composables/useGsap'

  const props = defineProps<{
    correct: boolean
    visible: boolean
  }>()

  const contentRef = ref<HTMLElement | null>(null)

  watch(() => props.visible, async show => {
    if (!show) return
    await nextTick()
    const gsap = await getGsap()
    if (!gsap || !contentRef.value) return

    if (props.correct) {
      gsap.from(contentRef.value, { scale: 0.5, opacity: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    } else {
      gsap.fromTo(contentRef.value, { x: 0 }, { x: 8, yoyo: true, repeat: 4, duration: 0.08, ease: 'power1.inOut' })
    }
  })
</script>
