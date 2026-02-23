import { describe, expect, it } from 'vitest'
import { animationsEnabled, getGsap } from './useGsap'

describe('useGsap', () => {
  describe('animationsEnabled', () => {
    it('should be false in test environment', () => {
      expect(animationsEnabled.value).toBe(false)
    })
  })

  describe('getGsap', () => {
    it('should return null when animations are disabled', async () => {
      const gsap = await getGsap()
      expect(gsap).toBeNull()
    })

    it('should return null when animationsEnabled is false', async () => {
      animationsEnabled.value = false
      const gsap = await getGsap()
      expect(gsap).toBeNull()
    })

    it('should return gsap instance when animations are enabled', async () => {
      animationsEnabled.value = true
      const gsap = await getGsap()
      expect(gsap).not.toBeNull()
      expect(gsap).toHaveProperty('to')
      expect(gsap).toHaveProperty('from')
      expect(gsap).toHaveProperty('fromTo')
      animationsEnabled.value = false
    })

    it('should cache the gsap instance across calls', async () => {
      animationsEnabled.value = true
      const first = await getGsap()
      const second = await getGsap()
      expect(first).toBe(second)
      animationsEnabled.value = false
    })
  })
})
