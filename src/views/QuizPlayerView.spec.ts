import type { VueWrapper } from '@vue/test-utils'
import type { Quiz } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useQuizStore } from '@/stores/quizStore'
import QuizPlayerView from './QuizPlayerView.vue'

const vuetify = createVuetify({ components, directives })

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ params: {} }),
}))

function makeQuiz (overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-1',
    title: 'Test Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Question 1',
        answers: [
          { id: 'q1-a1', text: 'Wrong', isCorrect: false },
          { id: 'q1-a2', text: 'Right', isCorrect: true },
        ],
      },
    ],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

const defaultProps = { id: 'quiz-1' }
function mountView (props: { id: string } = defaultProps): VueWrapper {
  return mount(QuizPlayerView, {
    props,
    global: { plugins: [vuetify] },
  })
}

describe('QuizPlayerView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockReset()
  })

  describe('quiz loading', () => {
    it('should render the QuizPlayer when quiz is found in store', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      expect(wrapper.find('[data-testid="quiz-player-card"]').exists()).toBe(true)
    })

    it('should display the quiz title from the store', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ title: 'My Fun Quiz' }))

      const wrapper = mountView()

      expect(wrapper.text()).toContain('My Fun Quiz')
    })

    it('should show not found when quiz id does not exist', () => {
      const wrapper = mountView({ id: 'nonexistent' })

      expect(wrapper.text()).toContain('Quiz not found')
    })
  })

  describe('back navigation', () => {
    it('should render a back button', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      expect(wrapper.find('[data-testid="back-btn"]').exists()).toBe(true)
    })

    it('should navigate to the quiz list when back is clicked', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      await wrapper.find('[data-testid="back-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-list' })
    })
  })

  describe('restart', () => {
    it('should navigate to the quiz list when restart finishes the play-again cycle', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      // Complete the quiz (1 question)
      await wrapper.find('[data-testid="answer-option-1"]').trigger('click')
      await wrapper.find('[data-testid="confirm-btn"]').trigger('click')
      await wrapper.find('[data-testid="next-btn"]').trigger('click')

      // Now on score screen — click play again
      await wrapper.find('[data-testid="play-again-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-list' })
    })
  })

  describe('design', () => {
    it('should use a v-container as the root layout', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      expect(wrapper.find('.v-container').exists()).toBe(true)
    })
  })
})
