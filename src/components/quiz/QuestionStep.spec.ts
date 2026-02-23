import type { VueWrapper } from '@vue/test-utils'
import type { PlayerAnswer, PlayerQuestion } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import QuestionStep from './QuestionStep.vue'

const vuetify = createVuetify({ components, directives })

function makeAnswer (overrides: Partial<PlayerAnswer> = {}): PlayerAnswer {
  return {
    id: crypto.randomUUID(),
    text: 'Answer',
    ...overrides,
  }
}

function makeQuestion (overrides: Partial<PlayerQuestion> = {}): PlayerQuestion {
  return {
    id: 'q-1',
    text: 'What is the capital of France?',
    answers: [
      makeAnswer({ id: 'a1', text: 'Berlin' }),
      makeAnswer({ id: 'a2', text: 'Paris' }),
      makeAnswer({ id: 'a3', text: 'Madrid' }),
    ],
    ...overrides,
  }
}

function mountStep (
  question: PlayerQuestion = makeQuestion(),
  props: Record<string, unknown> = {},
): VueWrapper {
  return mount(QuestionStep, {
    props: { question, ...props },
    global: { plugins: [vuetify] },
  })
}

describe('QuestionStep', () => {
  describe('rendering', () => {
    it('should render the question text', () => {
      const wrapper = mountStep()

      expect(wrapper.text()).toContain('What is the capital of France?')
    })

    it('should render an answer card for each answer option', () => {
      const wrapper = mountStep()

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      expect(answerCards).toHaveLength(3)
    })

    it('should display the answer text in each card', () => {
      const wrapper = mountStep()

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      expect(answerCards[0]!.text()).toContain('Berlin')
      expect(answerCards[1]!.text()).toContain('Paris')
      expect(answerCards[2]!.text()).toContain('Madrid')
    })

    it('should render a confirm button', () => {
      const wrapper = mountStep()

      expect(wrapper.find('[data-testid="confirm-btn"]').exists()).toBe(true)
    })
  })

  describe('answer selection', () => {
    it('should highlight the selected answer card', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="answer-option-1"]').trigger('click')

      const selected = wrapper.find('[data-testid="answer-option-1"]')
      expect(
        selected.classes().some(c => c.includes('bg-primary')),
      ).toBe(true)
    })

    it('should not highlight unselected answer cards', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="answer-option-1"]').trigger('click')

      const unselected = wrapper.find('[data-testid="answer-option-0"]')
      expect(
        unselected.classes().some(c => c.includes('bg-primary')),
      ).toBe(false)
    })

    it('should switch highlight when a different answer is clicked', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="answer-option-0"]').trigger('click')
      await wrapper.find('[data-testid="answer-option-2"]').trigger('click')

      const first = wrapper.find('[data-testid="answer-option-0"]')
      const third = wrapper.find('[data-testid="answer-option-2"]')

      expect(first.classes().some(c => c.includes('bg-primary'))).toBe(false)
      expect(third.classes().some(c => c.includes('bg-primary'))).toBe(true)
    })
  })

  describe('confirm button', () => {
    it('should disable the confirm button when no answer is selected', () => {
      const wrapper = mountStep()

      const btn = wrapper.find('[data-testid="confirm-btn"]')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('should enable the confirm button after an answer is selected', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="answer-option-0"]').trigger('click')

      const btn = wrapper.find('[data-testid="confirm-btn"]')
      expect(btn.attributes('disabled')).toBeUndefined()
    })

    it('should emit answer with the selected answer id when confirm is clicked', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="answer-option-1"]').trigger('click')
      await wrapper.find('[data-testid="confirm-btn"]').trigger('click')

      const emitted = wrapper.emitted('answer')
      expect(emitted).toBeTruthy()
      expect(emitted![0]![0]).toBe('a2')
    })

    it('should not emit answer if no answer is selected', async () => {
      const wrapper = mountStep()

      await wrapper.find('[data-testid="confirm-btn"]').trigger('click')

      expect(wrapper.emitted('answer')).toBeFalsy()
    })
  })

  describe('feedback', () => {
    it('should show correct feedback when feedbackResult is correct', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: true, correctAnswerId: 'a2' },
      })

      expect(wrapper.find('[data-testid="feedback-correct"]').exists()).toBe(true)
    })

    it('should show incorrect feedback when feedbackResult is incorrect', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: false, correctAnswerId: 'a2' },
      })

      expect(wrapper.find('[data-testid="feedback-incorrect"]').exists()).toBe(true)
    })

    it('should not show any feedback when feedbackResult is not provided', () => {
      const wrapper = mountStep()

      expect(wrapper.find('[data-testid="feedback-correct"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="feedback-incorrect"]').exists()).toBe(false)
    })

    it('should highlight the correct answer in green when feedback is shown', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: false, correctAnswerId: 'a2' },
      })

      const correctCard = wrapper.find('[data-testid="answer-option-1"]')
      expect(
        correctCard.classes().some(c => c.includes('bg-success')),
      ).toBe(true)
    })

    it('should highlight the wrong selected answer in red when feedback is incorrect', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: false, correctAnswerId: 'a2' },
        selectedAnswerId: 'a1',
      })

      const wrongCard = wrapper.find('[data-testid="answer-option-0"]')
      expect(
        wrongCard.classes().some(c => c.includes('bg-error')),
      ).toBe(true)
    })

    it('should not apply error or success styling to uninvolved answers when feedback is shown', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: false, correctAnswerId: 'a2' },
        selectedAnswerId: 'a1',
      })

      const neutralCard = wrapper.find('[data-testid="answer-option-2"]')
      expect(neutralCard.classes().some(c => c.includes('bg-error'))).toBe(false)
      expect(neutralCard.classes().some(c => c.includes('bg-success'))).toBe(false)
    })

    it('should use flat variant on all answer cards when feedback is displayed', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: false, correctAnswerId: 'a2' },
        selectedAnswerId: 'a1',
      })

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      for (const card of answerCards) {
        expect(card.classes()).toContain('v-card--variant-flat')
      }
    })

    it('should disable answer selection when feedback is displayed', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: true, correctAnswerId: 'a2' },
      })

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      for (const card of answerCards) {
        expect(card.classes()).toContain('v-card--disabled')
      }
    })

    it('should hide the confirm button when feedback is displayed', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: true, correctAnswerId: 'a2' },
      })

      expect(wrapper.find('[data-testid="confirm-btn"]').exists()).toBe(false)
    })

    it('should render a next button when feedback is displayed', () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: true, correctAnswerId: 'a2' },
      })

      expect(wrapper.find('[data-testid="next-btn"]').exists()).toBe(true)
    })

    it('should emit next when the next button is clicked', async () => {
      const wrapper = mountStep(makeQuestion(), {
        feedbackResult: { correct: true, correctAnswerId: 'a2' },
      })

      await wrapper.find('[data-testid="next-btn"]').trigger('click')

      expect(wrapper.emitted('next')).toBeTruthy()
    })
  })

  describe('regression: correct answer must not be visually distinguishable before confirmation', () => {
    it('should render all answer cards with identical classes before any selection', () => {
      const wrapper = mountStep()

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      const classLists = answerCards.map(card =>
        [...card.classes()].sort().join(','),
      )

      // Every card must share the exact same class set
      for (const cl of classLists) {
        expect(cl).toBe(classLists[0])
      }
    })

    it('should not expose isCorrect as a DOM attribute on any answer card', () => {
      const wrapper = mountStep()

      const html = wrapper.html()
      expect(html).not.toContain('iscorrect')
      expect(html).not.toContain('is-correct')
    })

    it('should not disable or grey out the correct answer before confirmation', () => {
      const wrapper = mountStep()

      // The correct answer is at index 1 (Paris, isCorrect: true)
      const correctCard = wrapper.find('[data-testid="answer-option-1"]')
      expect(correctCard.classes()).not.toContain('v-card--disabled')
      expect(correctCard.attributes('disabled')).toBeUndefined()
      expect(correctCard.attributes('aria-disabled')).toBeUndefined()
    })

    it('should give all answers the same variant before confirmation', () => {
      const wrapper = mountStep()

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      const variants = answerCards.map(card =>
        card.classes().find(c => c.startsWith('v-card--variant-')),
      )

      for (const v of variants) {
        expect(v).toBe(variants[0])
      }
    })
  })

  describe('design', () => {
    it('should wrap the component in a v-card', () => {
      const wrapper = mountStep()

      expect(wrapper.find('.v-card').exists()).toBe(true)
    })

    it('should render answer options as v-card elements', () => {
      const wrapper = mountStep()

      const answerCards = wrapper.findAll('[data-testid^="answer-option-"]')
      for (const card of answerCards) {
        expect(card.classes().some(c => c.includes('v-card'))).toBe(true)
      }
    })

    it('should render the confirm button with secondary color', () => {
      const wrapper = mountStep()

      const btn = wrapper.find('[data-testid="confirm-btn"]')
      expect(btn.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })
  })
})
