import type { VueWrapper } from '@vue/test-utils'
import type { Quiz } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useQuizStore } from '@/stores/quizStore'
import QuizEditorView from './QuizEditorView.vue'

const vuetify = createVuetify({ components, directives })

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ params: {} }),
}))

function makeQuiz (overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-1',
    title: 'Existing Quiz',
    questions: [
      {
        id: 'q1',
        text: 'What is 2+2?',
        answers: [
          { id: 'a1', text: 'Three', isCorrect: false },
          { id: 'a2', text: 'Four', isCorrect: true },
        ],
      },
    ],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

function mountView (props: { id?: string } = {}): VueWrapper {
  return mount(QuizEditorView, {
    props,
    global: { plugins: [vuetify] },
  })
}

describe('QuizEditorView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockReset()
  })

  describe('create mode', () => {
    it('should render a "New Quiz" title when no id is provided', () => {
      const wrapper = mountView()

      expect(wrapper.text()).toContain('New Quiz')
    })

    it('should render a QuizForm component', () => {
      const wrapper = mountView()

      expect(wrapper.find('[data-testid="quiz-form"]').exists()).toBe(true)
    })

    it('should render an empty QuizForm when no id is provided', () => {
      const wrapper = mountView()

      const input = wrapper.find('[data-testid="quiz-title"] input')
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('should add the quiz to the store when save is emitted', async () => {
      const store = useQuizStore()
      const wrapper = mountView()

      const titleInput = wrapper.find('[data-testid="quiz-title"] input')
      await titleInput.setValue('New Created Quiz')

      const questionInput = wrapper.find('[data-testid="question-text"] input')
      await questionInput.setValue('What is 1+1?')

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]!.title).toBe('New Created Quiz')
    })

    it('should navigate to the quiz list after saving', async () => {
      const wrapper = mountView()

      const titleInput = wrapper.find('[data-testid="quiz-title"] input')
      await titleInput.setValue('My Quiz')

      const questionInput = wrapper.find('[data-testid="question-text"] input')
      await questionInput.setValue('Sample question')

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-list' })
    })
  })

  describe('edit mode', () => {
    it('should render an "Edit Quiz" title when an id is provided', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView({ id: 'quiz-1' })

      expect(wrapper.text()).toContain('Edit Quiz')
    })

    it('should populate the form with the existing quiz data', () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz({ title: 'Loaded Quiz' }))

      const wrapper = mountView({ id: 'quiz-1' })

      const input = wrapper.find('[data-testid="quiz-title"] input')
      expect((input.element as HTMLInputElement).value).toBe('Loaded Quiz')
    })

    it('should update the quiz in the store when save is emitted in edit mode', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView({ id: 'quiz-1' })

      const titleInput = wrapper.find('[data-testid="quiz-title"] input')
      await titleInput.setValue('Updated Quiz Title')

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]!.title).toBe('Updated Quiz Title')
    })

    it('should navigate to the quiz list after updating', async () => {
      const store = useQuizStore()
      store.addQuiz(makeQuiz())

      const wrapper = mountView({ id: 'quiz-1' })

      const titleInput = wrapper.find('[data-testid="quiz-title"] input')
      await titleInput.setValue('Updated')

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-list' })
    })

    it('should show not found when quiz id does not exist in store', () => {
      const wrapper = mountView({ id: 'nonexistent' })

      expect(wrapper.text()).toContain('Quiz not found')
    })
  })

  describe('back navigation', () => {
    it('should render a back button', () => {
      const wrapper = mountView()

      expect(wrapper.find('[data-testid="back-btn"]').exists()).toBe(true)
    })

    it('should navigate to the quiz list when back is clicked', async () => {
      const wrapper = mountView()

      await wrapper.find('[data-testid="back-btn"]').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'quiz-list' })
    })
  })

  describe('design', () => {
    it('should use a v-container as the root layout', () => {
      const wrapper = mountView()

      expect(wrapper.find('.v-container').exists()).toBe(true)
    })
  })
})
