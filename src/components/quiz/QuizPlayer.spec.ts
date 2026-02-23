import type { VueWrapper } from '@vue/test-utils'
import type { Answer, Question, Quiz } from '@/types/quiz'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import QuizPlayer from './QuizPlayer.vue'

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

function makeTwoQuestionQuiz (): Quiz {
  return {
    id: 'quiz-1',
    title: 'Test Quiz',
    questions: [
      makeQuestion({
        id: 'q1',
        text: 'Question 1',
        answers: [
          makeAnswer({ id: 'q1-a1', text: 'Q1 Wrong', isCorrect: false }),
          makeAnswer({ id: 'q1-a2', text: 'Q1 Right', isCorrect: true }),
        ],
      }),
      makeQuestion({
        id: 'q2',
        text: 'Question 2',
        answers: [
          makeAnswer({ id: 'q2-a1', text: 'Q2 Wrong', isCorrect: false }),
          makeAnswer({ id: 'q2-a2', text: 'Q2 Right', isCorrect: true }),
        ],
      }),
    ],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  }
}

function mountPlayer (quiz: Quiz = makeTwoQuestionQuiz()): VueWrapper {
  return mount(QuizPlayer, {
    props: { quiz },
    global: { plugins: [vuetify] },
  })
}

async function selectAndConfirm (
  wrapper: VueWrapper,
  answerIndex: number,
): Promise<void> {
  await wrapper
    .find(`[data-testid="answer-option-${answerIndex}"]`)
    .trigger('click')
  await wrapper.find('[data-testid="confirm-btn"]').trigger('click')
}

async function advancePastQuestion (
  wrapper: VueWrapper,
  answerIndex: number,
): Promise<void> {
  await selectAndConfirm(wrapper, answerIndex)
  await wrapper.find('[data-testid="next-btn"]').trigger('click')
}

describe('QuizPlayer', () => {
  describe('rendering', () => {
    it('should render the quiz title', () => {
      const wrapper = mountPlayer()

      expect(wrapper.text()).toContain('Test Quiz')
    })

    it('should render a ProgressPath component', () => {
      const wrapper = mountPlayer()

      expect(wrapper.find('[data-testid="progress-path"]').exists()).toBe(true)
    })

    it('should render a QuestionStep for the first question', () => {
      const wrapper = mountPlayer()

      expect(wrapper.find('[data-testid="question-step"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Question 1')
    })

    it('should display the question counter', () => {
      const wrapper = mountPlayer()

      expect(wrapper.text()).toContain('1 / 2')
    })
  })

  describe('answer flow', () => {
    it('should show feedback after confirming an answer', async () => {
      const wrapper = mountPlayer()

      await selectAndConfirm(wrapper, 1)

      expect(wrapper.find('[data-testid="feedback-correct"]').exists()).toBe(
        true,
      )
    })

    it('should show incorrect feedback for a wrong answer', async () => {
      const wrapper = mountPlayer()

      await selectAndConfirm(wrapper, 0)

      expect(
        wrapper.find('[data-testid="feedback-incorrect"]').exists(),
      ).toBe(true)
    })

    it('should show a next button after confirming', async () => {
      const wrapper = mountPlayer()

      await selectAndConfirm(wrapper, 1)

      expect(wrapper.find('[data-testid="next-btn"]').exists()).toBe(true)
    })

    it('should advance to the next question when next is clicked', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)

      expect(wrapper.text()).toContain('Question 2')
      expect(wrapper.text()).toContain('2 / 2')
    })
  })

  describe('progress tracking', () => {
    it('should start with 0% progress', () => {
      const wrapper = mountPlayer()

      const progressBar = wrapper.find('[data-testid="progress-path"] .v-progress-linear')
      expect(progressBar.attributes('aria-valuenow')).toBe('0')
    })

    it('should update progress after advancing a question', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)

      const progressBar = wrapper.find('[data-testid="progress-path"] .v-progress-linear')
      expect(progressBar.attributes('aria-valuenow')).toBe('50')
    })
  })

  describe('score screen', () => {
    it('should show the ScoreScreen when all questions are answered', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)

      expect(wrapper.find('[data-testid="score-screen"]').exists()).toBe(true)
    })

    it('should not show the QuestionStep when quiz is complete', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)

      expect(wrapper.find('[data-testid="question-step"]').exists()).toBe(
        false,
      )
    })

    it('should display the final score', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 0)

      const scoreScreen = wrapper.find('[data-testid="score-screen"]')
      expect(scoreScreen.text()).toContain('1 / 2')
    })

    it('should display a perfect score when all answers are correct', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)

      const scoreScreen = wrapper.find('[data-testid="score-screen"]')
      expect(scoreScreen.text()).toContain('2 / 2')
      expect(scoreScreen.text()).toContain('100%')
    })

    it('should include question recap in the score screen', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 0)

      expect(wrapper.find('[data-testid="recap-item-0"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="recap-item-1"]').exists()).toBe(true)
    })
  })

  describe('restart', () => {
    it('should reset to the first question when restart is triggered', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)

      expect(wrapper.find('[data-testid="score-screen"]').exists()).toBe(true)

      await wrapper.find('[data-testid="play-again-btn"]').trigger('click')

      expect(wrapper.find('[data-testid="score-screen"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="question-step"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Question 1')
    })

    it('should reset progress to 0% after restart', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)
      await wrapper.find('[data-testid="play-again-btn"]').trigger('click')

      const progressBar = wrapper.find('[data-testid="progress-path"] .v-progress-linear')
      expect(progressBar.attributes('aria-valuenow')).toBe('0')
    })
  })

  describe('design', () => {
    it('should wrap the player in a v-card', () => {
      const wrapper = mountPlayer()

      expect(
        wrapper.find('[data-testid="quiz-player-card"]').exists(),
      ).toBe(true)
      expect(
        wrapper
          .find('[data-testid="quiz-player-card"]')
          .classes()
          .some(c => c.includes('v-card')),
      ).toBe(true)
    })

    it('should not show the progress path on the score screen', async () => {
      const wrapper = mountPlayer()

      await advancePastQuestion(wrapper, 1)
      await advancePastQuestion(wrapper, 1)

      expect(wrapper.find('[data-testid="progress-path"]').exists()).toBe(
        false,
      )
    })
  })
})
