<template>
  <div class="progress-path">
    <div class="progress-path__track">
      <v-progress-linear
        bg-color="grey-lighten-2"
        class="progress-path__line"
        color="secondary"
        height="6"
        :model-value="progressPercent"
        rounded
      />
    </div>

    <div ref="nodesRef" class="progress-path__nodes">
      <div
        v-for="(step, i) in total"
        :key="i"
        class="progress-path__node"
        :class="nodeClass(i)"
        :data-testid="`step-node-${i}`"
      >
        <v-icon v-if="i < current" icon="mdi-check" size="16" />
        <span v-else class="text-caption font-weight-bold">{{ i + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { getGsap } from '@/composables/useGsap'

  const props = defineProps<{
    total: number
    current: number
  }>()

  const nodesRef = ref<HTMLElement | null>(null)
  let pulseTween: any

  async function pulseCurrentNode () {
    await nextTick()
    const gsap = await getGsap()
    if (!gsap || !nodesRef.value) return
    if (pulseTween) pulseTween.kill()
    const nodes = nodesRef.value.querySelectorAll('.progress-path__node')
    const currentNode = nodes[props.current]
    if (!currentNode) return
    pulseTween = gsap.to(currentNode, { scale: 1.15, repeat: -1, yoyo: true, duration: 0.6, ease: 'sine.inOut' })
  }

  onMounted(pulseCurrentNode)
  watch(() => props.current, pulseCurrentNode)
  onUnmounted(() => {
    if (pulseTween) pulseTween.kill()
  })

  const progressPercent = computed(() =>
    props.total > 0
      ? Math.round((props.current / props.total) * 100)
      : 0,
  )

  function nodeClass (index: number): Record<string, boolean> {
    return {
      'bg-primary': index < props.current,
      'bg-secondary': index === props.current,
      'bg-grey': index > props.current,
      'progress-path__node--completed': index < props.current,
      'progress-path__node--current': index === props.current,
      'progress-path__node--upcoming': index > props.current,
    }
  }
</script>

<style scoped>
.progress-path {
  position: relative;
  padding: 16px 0;
}

.progress-path__track {
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  transform: translateY(-50%);
}

.progress-path__nodes {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.progress-path__node {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.progress-path__node--current {
  width: 42px;
  height: 42px;
  box-shadow: 0 2px 12px rgba(245, 166, 35, 0.4);
}

.progress-path__node--upcoming {
  color: white;
  opacity: 0.7;
}

.progress-path__node--completed {
  color: white;
}
</style>
