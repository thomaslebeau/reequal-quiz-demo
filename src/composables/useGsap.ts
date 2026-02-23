import type { gsap as GsapType } from 'gsap'
import { ref } from 'vue'

const isTestEnv = import.meta.env?.MODE === 'test'
  || import.meta.env?.VITEST === 'true'

const prefersReducedMotion = !isTestEnv
  && typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const animationsEnabled = ref(!isTestEnv && !prefersReducedMotion)

let gsapInstance: typeof GsapType | null = null

export async function getGsap (): Promise<typeof GsapType | null> {
  if (!animationsEnabled.value) {
    return null
  }
  if (gsapInstance) {
    return gsapInstance
  }
  const { gsap } = await import('gsap')
  gsapInstance = gsap
  return gsap
}
