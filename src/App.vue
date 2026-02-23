<template>
  <v-app>
    <v-main>
      <router-view v-slot="{ Component }">
        <transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { getGsap } from '@/composables/useGsap'

  async function onEnter (el: Element, done: () => void) {
    const gsap = await getGsap()
    if (!gsap) {
      done()
      return
    }
    gsap.from(el, { opacity: 0, x: 30, duration: 0.35, ease: 'power2.out', onComplete: done })
  }

  async function onLeave (el: Element, done: () => void) {
    const gsap = await getGsap()
    if (!gsap) {
      done()
      return
    }
    gsap.to(el, { opacity: 0, x: -30, duration: 0.25, ease: 'power2.in', onComplete: done })
  }
</script>
