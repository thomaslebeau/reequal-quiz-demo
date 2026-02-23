import type { VueWrapper } from '@vue/test-utils'
import type { Quiz } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import QuizCard from './QuizCard.vue'

const vuetify = createVuetify({ components, directives })

function makeQuiz (overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-1',
    title: 'JavaScript Basics',
    questions: [
      { id: 'q1', text: 'Q1', answers: [] },
      { id: 'q2', text: 'Q2', answers: [] },
      { id: 'q3', text: 'Q3', answers: [] },
    ],
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-20'),
    ...overrides,
  }
}

function mountCard (quiz: Quiz = makeQuiz()): VueWrapper {
  return mount(QuizCard, {
    props: { quiz },
    global: {
      plugins: [vuetify],
    },
  })
}

describe('QuizCard', () => {
  describe('content rendering', () => {
    it('should render the quiz title', () => {
      const wrapper = mountCard()

      expect(wrapper.text()).toContain('JavaScript Basics')
    })

    it('should render the question count', () => {
      const wrapper = mountCard()

      expect(wrapper.text()).toMatch(/3\s*questions/)
    })

    it('should render 1 question in singular form', () => {
      const quiz = makeQuiz({
        questions: [{ id: 'q1', text: 'Q1', answers: [] }],
      })
      const wrapper = mountCard(quiz)

      expect(wrapper.text()).toMatch(/1\s*question(?!s)/)
    })

    it('should render the formatted updatedAt date', () => {
      const wrapper = mountCard()

      expect(wrapper.text()).toMatch(/Feb.*20.*2026|20.*Feb.*2026|2\/20\/2026|02\/20\/2026/)
    })
  })

  describe('Vuetify structure', () => {
    it('should render a v-card element', () => {
      const wrapper = mountCard()

      expect(wrapper.find('.v-card').exists()).toBe(true)
    })

    it('should use rounded styling on the card', () => {
      const wrapper = mountCard()
      const card = wrapper.find('.v-card')

      expect(card.classes().some(c => c.includes('rounded'))).toBe(true)
    })
  })

  describe('action events', () => {
    it('should emit edit event with quiz id when edit button is clicked', async () => {
      const wrapper = mountCard()

      const editBtn = wrapper.find('[data-testid="edit-btn"]')
      expect(editBtn.exists()).toBe(true)

      await editBtn.trigger('click')

      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')![0]).toEqual(['quiz-1'])
    })

    it('should emit delete event with quiz id when delete button is clicked', async () => {
      const wrapper = mountCard()

      const deleteBtn = wrapper.find('[data-testid="delete-btn"]')
      expect(deleteBtn.exists()).toBe(true)

      await deleteBtn.trigger('click')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0]).toEqual(['quiz-1'])
    })

    it('should emit play event with quiz id when play button is clicked', async () => {
      const wrapper = mountCard()

      const playBtn = wrapper.find('[data-testid="play-btn"]')
      expect(playBtn.exists()).toBe(true)

      await playBtn.trigger('click')

      expect(wrapper.emitted('play')).toBeTruthy()
      expect(wrapper.emitted('play')![0]).toEqual(['quiz-1'])
    })
  })

  describe('design tokens', () => {
    it('should render a play button with secondary color', () => {
      const wrapper = mountCard()

      const playBtn = wrapper.find('[data-testid="play-btn"]')
      expect(playBtn.exists()).toBe(true)
      expect(playBtn.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })

    it('should render a question count chip or badge', () => {
      const wrapper = mountCard()

      expect(wrapper.find('.v-chip').exists()).toBe(true)
    })

    it('should display a quiz icon', () => {
      const wrapper = mountCard()

      expect(wrapper.find('.mdi-help-circle-outline, .mdi-frequently-asked-questions, .mdi-clipboard-text-outline, [class*="mdi-"]').exists()).toBe(true)
    })
  })
})
