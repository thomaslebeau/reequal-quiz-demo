import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia, setActivePinia } from 'pinia'
import QuizListView from './QuizListView.vue'
import { useQuizStore } from '@/stores/quizStore'
import type { Quiz } from '@/types/quiz'

const vuetify = createVuetify({ components, directives })

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ params: {} }),
}))

function makeQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: crypto.randomUUID(),
    title: 'Sample Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Q?',
        answers: [
          { id: 'a1', text: 'A', isCorrect: true },
          { id: 'a2', text: 'B', isCorrect: false },
        ],
      },
    ],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

function mountView(): VueWrapper {
  return mount(QuizListView, {
    global: { plugins: [vuetify] },
  })
}

describe('QuizListView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockReset()
  })

  describe('rendering', () => {
    it('should render a page title', () => {
      const wrapper = mountView()

      expect(wrapper.text()).toContain('Quizzes')
    })

    it('should render a QuizCard for each quiz in the store', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Quiz One' }))
      store.addQuiz(makeQuiz({ id: 'q2', title: 'Quiz Two' }))

      const wrapper = mountView()

      const cards = wrapper.findAll('[data-testid^="quiz-card-"]')
      expect(cards).toHaveLength(2)
    })

    it('should display the quiz title in each card', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Alpha Quiz' }))

      const wrapper = mountView()

      expect(wrapper.text()).toContain('Alpha Quiz')
    })

    it('should show an empty state when no quizzes exist', () => {
      const wrapper = mountView()

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    it('should not show empty state when quizzes exist', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView()

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    })
  })

  describe('search', () => {
    it('should render a search input', () => {
      const wrapper = mountView()

      expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true)
    })

    it('should filter quizzes by title when search text is entered', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Math Quiz' }))
      store.addQuiz(makeQuiz({ id: 'q2', title: 'Science Quiz' }))
      store.addQuiz(makeQuiz({ id: 'q3', title: 'History Test' }))

      const wrapper = mountView()

      const input = wrapper.find('[data-testid="search-input"] input')
      await input.setValue('quiz')

      const cards = wrapper.findAll('[data-testid^="quiz-card-"]')
      expect(cards).toHaveLength(2)
    })

    it('should be case insensitive', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Math Quiz' }))

      const wrapper = mountView()

      const input = wrapper.find('[data-testid="search-input"] input')
      await input.setValue('MATH')

      const cards = wrapper.findAll('[data-testid^="quiz-card-"]')
      expect(cards).toHaveLength(1)
    })
  })

  describe('create quiz', () => {
    it('should render a create new quiz button', () => {
      const wrapper = mountView()

      expect(wrapper.find('[data-testid="create-quiz-btn"]').exists()).toBe(true)
    })

    it('should navigate to /quiz/new when create button is clicked', async () => {
      const wrapper = mountView()

      await wrapper.find('[data-testid="create-quiz-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-create' })
    })
  })

  describe('quiz actions', () => {
    it('should navigate to edit when edit is triggered on a card', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Test' }))

      const wrapper = mountView()

      await wrapper.find('[data-testid="edit-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-edit', params: { id: 'q1' } })
    })

    it('should remove the quiz from store when delete is triggered', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Test' }))

      const wrapper = mountView()

      await wrapper.find('[data-testid="delete-btn"]').trigger('click')

      expect(store.quizzes).toHaveLength(0)
    })

    it('should navigate to play when play is triggered on a card', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ id: 'q1', title: 'Test' }))

      const wrapper = mountView()

      await wrapper.find('[data-testid="play-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-play', params: { id: 'q1' } })
    })
  })

  describe('design', () => {
    it('should use a v-container as the root layout', () => {
      const wrapper = mountView()

      expect(wrapper.find('.v-container').exists()).toBe(true)
    })
  })
})
