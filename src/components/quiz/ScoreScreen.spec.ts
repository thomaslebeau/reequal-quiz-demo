import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ScoreScreen from './ScoreScreen.vue'
import type { QuestionResult } from '@/types/quiz'

const vuetify = createVuetify({ components, directives })

function makeResult(overrides: Partial<QuestionResult> = {}): QuestionResult {
  return {
    questionText: 'Sample question',
    correct: true,
    selectedAnswerText: 'Right answer',
    correctAnswerText: 'Right answer',
    ...overrides,
  }
}

function mountScreen(
  props: {
    score?: number
    total?: number
    results?: QuestionResult[]
  } = {},
): VueWrapper {
  const defaults = {
    score: 3,
    total: 5,
    results: [
      makeResult({ questionText: 'Q1', correct: true }),
      makeResult({ questionText: 'Q2', correct: false, selectedAnswerText: 'Wrong', correctAnswerText: 'Right' }),
      makeResult({ questionText: 'Q3', correct: true }),
      makeResult({ questionText: 'Q4', correct: false, selectedAnswerText: 'Nope', correctAnswerText: 'Yes' }),
      makeResult({ questionText: 'Q5', correct: true }),
    ],
  }
  return mount(ScoreScreen, {
    props: { ...defaults, ...props },
    global: { plugins: [vuetify] },
  })
}

describe('ScoreScreen', () => {
  describe('score display', () => {
    it('should display the score as a fraction', () => {
      const wrapper = mountScreen({ score: 3, total: 5 })

      expect(wrapper.text()).toContain('3 / 5')
    })

    it('should display the score as a percentage', () => {
      const wrapper = mountScreen({ score: 3, total: 5 })

      expect(wrapper.text()).toContain('60%')
    })

    it('should render a v-progress-circular with the percentage', () => {
      const wrapper = mountScreen({ score: 4, total: 5 })

      const progress = wrapper.find('[data-testid="score-progress"]')
      expect(progress.exists()).toBe(true)
      expect(progress.attributes('aria-valuenow')).toBe('80')
    })

    it('should display a perfect score correctly', () => {
      const wrapper = mountScreen({
        score: 5,
        total: 5,
        results: Array.from({ length: 5 }, (_, i) =>
          makeResult({ questionText: `Q${i + 1}`, correct: true }),
        ),
      })

      expect(wrapper.text()).toContain('5 / 5')
      expect(wrapper.text()).toContain('100%')
    })

    it('should display a zero score correctly', () => {
      const wrapper = mountScreen({
        score: 0,
        total: 3,
        results: Array.from({ length: 3 }, (_, i) =>
          makeResult({
            questionText: `Q${i + 1}`,
            correct: false,
            selectedAnswerText: 'Wrong',
            correctAnswerText: 'Right',
          }),
        ),
      })

      expect(wrapper.text()).toContain('0 / 3')
      expect(wrapper.text()).toContain('0%')
    })
  })

  describe('message', () => {
    it('should show a congratulation message when score is above 70%', () => {
      const wrapper = mountScreen({ score: 4, total: 5 })

      const message = wrapper.find('[data-testid="result-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('Great job')
    })

    it('should show a congratulation message at exactly 70%', () => {
      const wrapper = mountScreen({
        score: 7,
        total: 10,
        results: Array.from({ length: 10 }, (_, i) =>
          makeResult({ questionText: `Q${i + 1}`, correct: i < 7 }),
        ),
      })

      const message = wrapper.find('[data-testid="result-message"]')
      expect(message.text()).toContain('Great job')
    })

    it('should show an encouragement message when score is below 70%', () => {
      const wrapper = mountScreen({ score: 2, total: 5 })

      const message = wrapper.find('[data-testid="result-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('Keep practicing')
    })
  })

  describe('question recap', () => {
    it('should render a recap item for each question', () => {
      const wrapper = mountScreen()

      const recapItems = wrapper.findAll('[data-testid^="recap-item-"]')
      expect(recapItems).toHaveLength(5)
    })

    it('should display the question text in each recap item', () => {
      const wrapper = mountScreen()

      const recapItems = wrapper.findAll('[data-testid^="recap-item-"]')
      expect(recapItems[0].text()).toContain('Q1')
      expect(recapItems[1].text()).toContain('Q2')
    })

    it('should show a success icon for correct answers', () => {
      const wrapper = mountScreen()

      const correctItem = wrapper.find('[data-testid="recap-item-0"]')
      expect(correctItem.find('[data-testid="recap-icon-correct"]').exists()).toBe(true)
    })

    it('should show an error icon for incorrect answers', () => {
      const wrapper = mountScreen()

      const incorrectItem = wrapper.find('[data-testid="recap-item-1"]')
      expect(incorrectItem.find('[data-testid="recap-icon-incorrect"]').exists()).toBe(true)
    })

    it('should display the correct answer for incorrect questions', () => {
      const wrapper = mountScreen()

      const incorrectItem = wrapper.find('[data-testid="recap-item-1"]')
      expect(incorrectItem.text()).toContain('Right')
    })

    it('should display the selected wrong answer for incorrect questions', () => {
      const wrapper = mountScreen()

      const incorrectItem = wrapper.find('[data-testid="recap-item-1"]')
      expect(incorrectItem.text()).toContain('Wrong')
    })
  })

  describe('play again', () => {
    it('should render a play again button', () => {
      const wrapper = mountScreen()

      expect(wrapper.find('[data-testid="play-again-btn"]').exists()).toBe(true)
    })

    it('should emit restart when play again is clicked', async () => {
      const wrapper = mountScreen()

      await wrapper.find('[data-testid="play-again-btn"]').trigger('click')

      expect(wrapper.emitted('restart')).toBeTruthy()
    })
  })

  describe('design', () => {
    it('should wrap the component in a v-card', () => {
      const wrapper = mountScreen()

      expect(wrapper.find('.v-card').exists()).toBe(true)
    })

    it('should render the play again button with secondary color', () => {
      const wrapper = mountScreen()

      const btn = wrapper.find('[data-testid="play-again-btn"]')
      expect(btn.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })

    it('should render recap items as v-card elements', () => {
      const wrapper = mountScreen()

      const recapItems = wrapper.findAll('[data-testid^="recap-item-"]')
      for (const item of recapItems) {
        expect(item.classes().some(c => c.includes('v-card'))).toBe(true)
      }
    })

    it('should use success color on the progress circular for scores >= 70%', () => {
      const wrapper = mountScreen({ score: 4, total: 5 })

      const progress = wrapper.find('[data-testid="score-progress"]')
      expect(progress.classes().some(c => c.includes('text-success'))).toBe(true)
    })

    it('should use warning color on the progress circular for scores < 70%', () => {
      const wrapper = mountScreen({ score: 2, total: 5 })

      const progress = wrapper.find('[data-testid="score-progress"]')
      expect(progress.classes().some(c => c.includes('text-warning'))).toBe(true)
    })
  })
})
