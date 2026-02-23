import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import QuestionEditor from './QuestionEditor.vue'
import type { Question, Answer } from '@/types/quiz'

const vuetify = createVuetify({ components, directives })

function makeAnswer(overrides: Partial<Answer> = {}): Answer {
  return {
    id: crypto.randomUUID(),
    text: '',
    isCorrect: false,
    ...overrides,
  }
}

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q-1',
    text: 'What is 2+2?',
    answers: [
      makeAnswer({ id: 'a1', text: 'Three', isCorrect: false }),
      makeAnswer({ id: 'a2', text: 'Four', isCorrect: true }),
    ],
    ...overrides,
  }
}

function mountEditor(
  question: Question = makeQuestion(),
  index = 0,
): VueWrapper {
  return mount(QuestionEditor, {
    props: { question, index },
    global: { plugins: [vuetify] },
  })
}

describe('QuestionEditor', () => {
  describe('rendering', () => {
    it('should render the question index label', () => {
      const wrapper = mountEditor(makeQuestion(), 2)

      expect(wrapper.text()).toContain('Question 3')
    })

    it('should render a text input with the question text', () => {
      const wrapper = mountEditor()

      const input = wrapper.find('[data-testid="question-text"]')
      expect(input.exists()).toBe(true)

      const inputEl = input.find('input')
      expect(inputEl.element.value).toBe('What is 2+2?')
    })

    it('should render a text input for each answer', () => {
      const question = makeQuestion({
        answers: [
          makeAnswer({ id: 'a1', text: 'One' }),
          makeAnswer({ id: 'a2', text: 'Two' }),
          makeAnswer({ id: 'a3', text: 'Three' }),
        ],
      })
      const wrapper = mountEditor(question)

      const answerInputs = wrapper.findAll('[data-testid^="answer-text-"]')
      expect(answerInputs).toHaveLength(3)
    })

    it('should render each answer text value in its input', () => {
      const wrapper = mountEditor()

      const first = wrapper.find('[data-testid="answer-text-0"] input')
      const second = wrapper.find('[data-testid="answer-text-1"] input')

      expect(first.element.value).toBe('Three')
      expect(second.element.value).toBe('Four')
    })

    it('should render a v-card wrapping the editor', () => {
      const wrapper = mountEditor()

      expect(wrapper.find('.v-card').exists()).toBe(true)
    })
  })

  describe('correct answer toggle', () => {
    it('should render a toggle for each answer', () => {
      const wrapper = mountEditor()

      const toggles = wrapper.findAll('[data-testid^="correct-toggle-"]')
      expect(toggles).toHaveLength(2)
    })

    it('should show the correct answer as checked', () => {
      const wrapper = mountEditor()

      const toggle1 = wrapper.find('[data-testid="correct-toggle-0"]')
      const toggle2 = wrapper.find('[data-testid="correct-toggle-1"]')

      expect(toggle1.find('input').element.checked).toBe(false)
      expect(toggle2.find('input').element.checked).toBe(true)
    })

    it('should emit update:question with new correct answer when toggled', async () => {
      const wrapper = mountEditor()

      const toggle = wrapper.find('[data-testid="correct-toggle-0"] input')
      await toggle.setValue(true)

      const emitted = wrapper.emitted('update:question')
      expect(emitted).toBeTruthy()

      const updated: Question = emitted![emitted!.length - 1][0] as Question
      expect(updated.answers[0].isCorrect).toBe(true)
      expect(updated.answers[1].isCorrect).toBe(false)
    })
  })

  describe('question text editing', () => {
    it('should emit update:question when question text changes', async () => {
      const wrapper = mountEditor()

      const input = wrapper.find('[data-testid="question-text"] input')
      await input.setValue('New question text')

      const emitted = wrapper.emitted('update:question')
      expect(emitted).toBeTruthy()

      const updated: Question = emitted![emitted!.length - 1][0] as Question
      expect(updated.text).toBe('New question text')
    })
  })

  describe('answer text editing', () => {
    it('should emit update:question when answer text changes', async () => {
      const wrapper = mountEditor()

      const input = wrapper.find('[data-testid="answer-text-0"] input')
      await input.setValue('Updated answer')

      const emitted = wrapper.emitted('update:question')
      expect(emitted).toBeTruthy()

      const updated: Question = emitted![emitted!.length - 1][0] as Question
      expect(updated.answers[0].text).toBe('Updated answer')
    })
  })

  describe('add answer', () => {
    it('should render an add answer button', () => {
      const wrapper = mountEditor()

      expect(wrapper.find('[data-testid="add-answer-btn"]').exists()).toBe(true)
    })

    it('should emit update:question with a new empty answer when add is clicked', async () => {
      const wrapper = mountEditor()

      await wrapper.find('[data-testid="add-answer-btn"]').trigger('click')

      const emitted = wrapper.emitted('update:question')
      expect(emitted).toBeTruthy()

      const updated: Question = emitted![emitted!.length - 1][0] as Question
      expect(updated.answers).toHaveLength(3)
      expect(updated.answers[2].text).toBe('')
      expect(updated.answers[2].isCorrect).toBe(false)
      expect(updated.answers[2].id).toBeDefined()
    })

    it('should disable the add button when there are already 4 answers', () => {
      const question = makeQuestion({
        answers: [
          makeAnswer({ id: 'a1', text: 'A' }),
          makeAnswer({ id: 'a2', text: 'B' }),
          makeAnswer({ id: 'a3', text: 'C' }),
          makeAnswer({ id: 'a4', text: 'D' }),
        ],
      })
      const wrapper = mountEditor(question)

      const addBtn = wrapper.find('[data-testid="add-answer-btn"]')
      expect(addBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('remove answer', () => {
    it('should render a remove button for each answer', () => {
      const question = makeQuestion({
        answers: [
          makeAnswer({ id: 'a1', text: 'A' }),
          makeAnswer({ id: 'a2', text: 'B' }),
          makeAnswer({ id: 'a3', text: 'C' }),
        ],
      })
      const wrapper = mountEditor(question)

      const removeBtns = wrapper.findAll('[data-testid^="remove-answer-"]')
      expect(removeBtns).toHaveLength(3)
    })

    it('should emit update:question without the removed answer when remove is clicked', async () => {
      const question = makeQuestion({
        answers: [
          makeAnswer({ id: 'a1', text: 'A' }),
          makeAnswer({ id: 'a2', text: 'B' }),
          makeAnswer({ id: 'a3', text: 'C' }),
        ],
      })
      const wrapper = mountEditor(question)

      await wrapper.find('[data-testid="remove-answer-1"]').trigger('click')

      const emitted = wrapper.emitted('update:question')
      expect(emitted).toBeTruthy()

      const updated: Question = emitted![emitted!.length - 1][0] as Question
      expect(updated.answers).toHaveLength(2)
      expect(updated.answers.map(a => a.id)).toEqual(['a1', 'a3'])
    })

    it('should disable remove buttons when there are only 2 answers', () => {
      const wrapper = mountEditor()

      const removeBtns = wrapper.findAll('[data-testid^="remove-answer-"]')
      for (const btn of removeBtns) {
        expect(btn.attributes('disabled')).toBeDefined()
      }
    })
  })

  describe('validation', () => {
    it('should show an error when question text is empty', async () => {
      const question = makeQuestion({ text: '' })
      const wrapper = mountEditor(question)

      await wrapper.vm.$nextTick()

      const questionField = wrapper.find('[data-testid="question-text"]')
      expect(questionField.text()).toContain('Question text is required')
    })

    it('should show an error when no correct answer is selected', async () => {
      const question = makeQuestion({
        answers: [
          makeAnswer({ id: 'a1', text: 'A', isCorrect: false }),
          makeAnswer({ id: 'a2', text: 'B', isCorrect: false }),
        ],
      })
      const wrapper = mountEditor(question)

      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Mark one answer as correct')
    })
  })
})
