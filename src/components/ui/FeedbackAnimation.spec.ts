import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import FeedbackAnimation from './FeedbackAnimation.vue'

const vuetify = createVuetify({ components, directives })

function mountFeedback(
  correct: boolean,
  visible: boolean,
): VueWrapper {
  return mount(FeedbackAnimation, {
    props: { correct, visible },
    global: { plugins: [vuetify] },
  })
}

describe('FeedbackAnimation', () => {
  describe('visibility', () => {
    it('should render content when visible is true', () => {
      const wrapper = mountFeedback(true, true)

      expect(wrapper.find('[data-testid="feedback-content"]').exists()).toBe(true)
    })

    it('should not render content when visible is false', () => {
      const wrapper = mountFeedback(true, false)

      expect(wrapper.find('[data-testid="feedback-content"]').exists()).toBe(false)
    })
  })

  describe('correct feedback', () => {
    it('should show a check icon when correct', () => {
      const wrapper = mountFeedback(true, true)

      expect(wrapper.find('.mdi-check-circle').exists()).toBe(true)
    })

    it('should apply the correct animation class', () => {
      const wrapper = mountFeedback(true, true)

      const content = wrapper.find('[data-testid="feedback-content"]')
      expect(content.classes()).toContain('feedback-correct')
    })

    it('should use success color for the icon', () => {
      const wrapper = mountFeedback(true, true)

      const icon = wrapper.find('[data-testid="feedback-icon"]')
      expect(icon.classes().some(c => c.includes('text-success'))).toBe(true)
    })

    it('should display a correct message', () => {
      const wrapper = mountFeedback(true, true)

      expect(wrapper.text()).toContain('Correct')
    })
  })

  describe('incorrect feedback', () => {
    it('should show an X icon when incorrect', () => {
      const wrapper = mountFeedback(false, true)

      expect(wrapper.find('.mdi-close-circle').exists()).toBe(true)
    })

    it('should apply the incorrect animation class', () => {
      const wrapper = mountFeedback(false, true)

      const content = wrapper.find('[data-testid="feedback-content"]')
      expect(content.classes()).toContain('feedback-incorrect')
    })

    it('should use error color for the icon', () => {
      const wrapper = mountFeedback(false, true)

      const icon = wrapper.find('[data-testid="feedback-icon"]')
      expect(icon.classes().some(c => c.includes('text-error'))).toBe(true)
    })

    it('should display an incorrect message', () => {
      const wrapper = mountFeedback(false, true)

      expect(wrapper.text()).toContain('Incorrect')
    })
  })
})
