import type { VueWrapper } from '@vue/test-utils'
import type { Answer, Question, Quiz } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import QuizForm from './QuizForm.vue'

const vuetify = createVuetify({ components, directives })

function makeAnswer (overrides: Partial<Answer> = {}): Answer {
  return {
    id: crypto.randomUUID(),
    text: 'Answer',
    isCorrect: false,
    ...overrides,
  }
}

function makeQuestion (overrides: Partial<Question> = {}): Question {
  return {
    id: crypto.randomUUID(),
    text: 'Sample question',
    answers: [
      makeAnswer({ text: 'Wrong', isCorrect: false }),
      makeAnswer({ text: 'Right', isCorrect: true }),
    ],
    ...overrides,
  }
}

function makeQuiz (overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-1',
    title: 'Test Quiz',
    questions: [makeQuestion()],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

function mountForm (quiz?: Quiz): VueWrapper {
  return mount(QuizForm, {
    props: quiz ? { quiz } : {},
    global: { plugins: [vuetify] },
  })
}

describe('QuizForm', () => {
  describe('title input', () => {
    it('should render a title text field', () => {
      const wrapper = mountForm()

      const titleInput = wrapper.find('[data-testid="quiz-title"]')
      expect(titleInput.exists()).toBe(true)
    })

    it('should populate the title from the quiz prop', () => {
      const wrapper = mountForm(makeQuiz({ title: 'Existing Quiz' }))

      const input = wrapper.find('[data-testid="quiz-title"] input')
      expect((input.element as HTMLInputElement).value).toBe('Existing Quiz')
    })

    it('should start with an empty title when no quiz prop is provided', () => {
      const wrapper = mountForm()

      const input = wrapper.find('[data-testid="quiz-title"] input')
      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('question list', () => {
    it('should render a QuestionEditor for each question in the quiz', () => {
      const quiz = makeQuiz({
        questions: [makeQuestion(), makeQuestion()],
      })
      const wrapper = mountForm(quiz)

      const editors = wrapper.findAll('[data-testid^="question-editor-"]')
      expect(editors).toHaveLength(2)
    })

    it('should render one empty question by default when no quiz prop', () => {
      const wrapper = mountForm()

      const editors = wrapper.findAll('[data-testid^="question-editor-"]')
      expect(editors).toHaveLength(1)
    })
  })

  describe('add question', () => {
    it('should render an add question button', () => {
      const wrapper = mountForm()

      expect(wrapper.find('[data-testid="add-question-btn"]').exists()).toBe(true)
    })

    it('should add a new QuestionEditor when add question is clicked', async () => {
      const wrapper = mountForm()

      expect(wrapper.findAll('[data-testid^="question-editor-"]')).toHaveLength(1)

      await wrapper.find('[data-testid="add-question-btn"]').trigger('click')

      expect(wrapper.findAll('[data-testid^="question-editor-"]')).toHaveLength(2)
    })
  })

  describe('remove question', () => {
    it('should render a remove button for each question', () => {
      const quiz = makeQuiz({
        questions: [makeQuestion(), makeQuestion()],
      })
      const wrapper = mountForm(quiz)

      const removeBtns = wrapper.findAll('[data-testid^="remove-question-"]')
      expect(removeBtns).toHaveLength(2)
    })

    it('should remove the question when its remove button is clicked', async () => {
      const quiz = makeQuiz({
        questions: [makeQuestion(), makeQuestion()],
      })
      const wrapper = mountForm(quiz)

      await wrapper.find('[data-testid="remove-question-0"]').trigger('click')

      expect(wrapper.findAll('[data-testid^="question-editor-"]')).toHaveLength(1)
    })

    it('should disable remove when there is only 1 question', () => {
      const wrapper = mountForm()

      const removeBtn = wrapper.find('[data-testid="remove-question-0"]')
      expect(removeBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('save', () => {
    it('should render a save button', () => {
      const wrapper = mountForm()

      expect(wrapper.find('[data-testid="save-btn"]').exists()).toBe(true)
    })

    it('should emit save with a Quiz object when valid form is submitted', async () => {
      const quiz = makeQuiz({ title: 'My Quiz' })
      const wrapper = mountForm(quiz)

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      const emitted = wrapper.emitted('save')
      expect(emitted).toBeTruthy()

      const saved: Quiz = emitted![0]![0] as Quiz
      expect(saved.title).toBe('My Quiz')
      expect(saved.questions).toHaveLength(1)
      expect(saved.id).toBeDefined()
    })

    it('should include updated title in the emitted quiz', async () => {
      const wrapper = mountForm(makeQuiz())

      const input = wrapper.find('[data-testid="quiz-title"] input')
      await input.setValue('Changed Title')

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      const emitted = wrapper.emitted('save')
      expect(emitted).toBeTruthy()

      const saved: Quiz = emitted![0]![0] as Quiz
      expect(saved.title).toBe('Changed Title')
    })
  })

  describe('form validation', () => {
    it('should show an error when title is empty and save is attempted', async () => {
      const wrapper = mountForm()

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(wrapper.text()).toContain('Quiz title is required')
    })

    it('should not emit save when title is empty', async () => {
      const wrapper = mountForm()

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(wrapper.emitted('save')).toBeFalsy()
    })

    it('should not emit save when a question has no correct answer', async () => {
      const quiz = makeQuiz({
        title: 'Valid Title',
        questions: [
          makeQuestion({
            text: 'No correct',
            answers: [
              makeAnswer({ text: 'A', isCorrect: false }),
              makeAnswer({ text: 'B', isCorrect: false }),
            ],
          }),
        ],
      })
      const wrapper = mountForm(quiz)

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(wrapper.emitted('save')).toBeFalsy()
    })

    it('should show a validation message when a question has no correct answer', async () => {
      const quiz = makeQuiz({
        title: 'Valid Title',
        questions: [
          makeQuestion({
            text: 'No correct',
            answers: [
              makeAnswer({ text: 'A', isCorrect: false }),
              makeAnswer({ text: 'B', isCorrect: false }),
            ],
          }),
        ],
      })
      const wrapper = mountForm(quiz)

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(wrapper.text()).toContain('Each question must have a correct answer')
    })

    it('should not emit save when a question has empty text', async () => {
      const quiz = makeQuiz({
        title: 'Valid Title',
        questions: [
          makeQuestion({
            text: '',
            answers: [
              makeAnswer({ text: 'A', isCorrect: true }),
              makeAnswer({ text: 'B', isCorrect: false }),
            ],
          }),
        ],
      })
      const wrapper = mountForm(quiz)

      await wrapper.find('[data-testid="save-btn"]').trigger('click')

      expect(wrapper.emitted('save')).toBeFalsy()
    })
  })

  describe('design', () => {
    it('should use a v-form element', () => {
      const wrapper = mountForm()

      expect(wrapper.find('.v-form').exists()).toBe(true)
    })

    it('should render the save button with secondary color', () => {
      const wrapper = mountForm()

      const saveBtn = wrapper.find('[data-testid="save-btn"]')
      expect(saveBtn.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })
  })
})
