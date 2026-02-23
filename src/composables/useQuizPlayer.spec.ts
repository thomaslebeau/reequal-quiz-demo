import { describe, it, expect, beforeEach } from 'vitest'
import { useQuizPlayer } from './useQuizPlayer'
import type { Quiz, Question, Answer } from '@/types/quiz'

function makeAnswer(overrides: Partial<Answer> = {}): Answer {
  return {
    id: crypto.randomUUID(),
    text: 'Answer',
    isCorrect: false,
    ...overrides,
  }
}

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: crypto.randomUUID(),
    text: 'Question',
    answers: [],
    ...overrides,
  }
}

function makeQuiz(questions: Question[]): Quiz {
  return {
    id: 'quiz-1',
    title: 'Test Quiz',
    questions,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function buildThreeQuestionQuiz() {
  const q1 = makeQuestion({
    text: 'Q1',
    answers: [
      makeAnswer({ id: 'a1-correct', text: 'Right', isCorrect: true }),
      makeAnswer({ id: 'a1-wrong', text: 'Wrong', isCorrect: false }),
    ],
  })
  const q2 = makeQuestion({
    text: 'Q2',
    answers: [
      makeAnswer({ id: 'a2-wrong', text: 'Wrong', isCorrect: false }),
      makeAnswer({ id: 'a2-correct', text: 'Right', isCorrect: true }),
    ],
  })
  const q3 = makeQuestion({
    text: 'Q3',
    answers: [
      makeAnswer({ id: 'a3-correct', text: 'Right', isCorrect: true }),
      makeAnswer({ id: 'a3-wrong', text: 'Wrong', isCorrect: false }),
    ],
  })
  return { quiz: makeQuiz([q1, q2, q3]), q1, q2, q3 }
}

describe('useQuizPlayer', () => {
  describe('initial state', () => {
    it('should start at question index 0', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { currentIndex } = useQuizPlayer(quiz)

      expect(currentIndex.value).toBe(0)
    })

    it('should set currentQuestion to the first question', () => {
      const { quiz, q1 } = buildThreeQuestionQuiz()
      const { currentQuestion } = useQuizPlayer(quiz)

      expect(currentQuestion.value).toEqual(q1)
    })

    it('should set progress to 0', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { progress } = useQuizPlayer(quiz)

      expect(progress.value).toBe(0)
    })

    it('should set score to 0', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { score } = useQuizPlayer(quiz)

      expect(score.value).toBe(0)
    })

    it('should expose totalQuestions', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { totalQuestions } = useQuizPlayer(quiz)

      expect(totalQuestions.value).toBe(3)
    })

    it('should not be complete', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { isComplete } = useQuizPlayer(quiz)

      expect(isComplete.value).toBe(false)
    })
  })

  describe('selectAnswer', () => {
    it('should store the selected answer for the current question', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      const result = submitAnswer()

      expect(result.correct).toBe(true)
    })

    it('should allow changing the selection before submit', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      selectAnswer('a1-wrong')
      const result = submitAnswer()

      expect(result.correct).toBe(false)
    })
  })

  describe('submitAnswer', () => {
    it('should return correct: true when the selected answer is correct', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      const result = submitAnswer()

      expect(result.correct).toBe(true)
      expect(result.correctAnswerId).toBe('a1-correct')
    })

    it('should return correct: false when the selected answer is wrong', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer } = useQuizPlayer(quiz)

      selectAnswer('a1-wrong')
      const result = submitAnswer()

      expect(result.correct).toBe(false)
      expect(result.correctAnswerId).toBe('a1-correct')
    })

    it('should increment score when the answer is correct', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer, score } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      submitAnswer()

      expect(score.value).toBe(1)
    })

    it('should not increment score when the answer is wrong', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer, score } = useQuizPlayer(quiz)

      selectAnswer('a1-wrong')
      submitAnswer()

      expect(score.value).toBe(0)
    })
  })

  describe('nextQuestion', () => {
    it('should advance currentIndex by 1', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer, nextQuestion, currentIndex } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      submitAnswer()
      nextQuestion()

      expect(currentIndex.value).toBe(1)
    })

    it('should update currentQuestion to the next question', () => {
      const { quiz, q2 } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer, nextQuestion, currentQuestion } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      submitAnswer()
      nextQuestion()

      expect(currentQuestion.value).toEqual(q2)
    })

    it('should not advance beyond the last question', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      // Go through all 3 questions
      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a3-correct')
      player.submitAnswer()
      player.nextQuestion()

      // Try advancing past the end
      player.nextQuestion()

      expect(player.currentIndex.value).toBe(3)
    })
  })

  describe('progress', () => {
    it('should be 0 at the start', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { progress } = useQuizPlayer(quiz)

      expect(progress.value).toBe(0)
    })

    it('should reflect the fraction of questions answered', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const { selectAnswer, submitAnswer, nextQuestion, progress } = useQuizPlayer(quiz)

      selectAnswer('a1-correct')
      submitAnswer()
      nextQuestion()

      expect(progress.value).toBeCloseTo(33.33, 1)
    })

    it('should be 100 when all questions are answered', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a3-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.progress.value).toBe(100)
    })
  })

  describe('score tracking', () => {
    it('should accumulate score across multiple correct answers', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.score.value).toBe(2)
    })

    it('should track mixed correct and incorrect answers', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-wrong')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a3-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.score.value).toBe(2)
    })

    it('should report 0 when all answers are wrong', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-wrong')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-wrong')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a3-wrong')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.score.value).toBe(0)
    })
  })

  describe('isComplete', () => {
    it('should be false while questions remain', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.isComplete.value).toBe(false)
    })

    it('should be true after the last question is answered and advanced', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a2-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.selectAnswer('a3-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.isComplete.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should return to question 0', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.reset()

      expect(player.currentIndex.value).toBe(0)
    })

    it('should clear the score', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.reset()

      expect(player.score.value).toBe(0)
    })

    it('should reset progress to 0', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()

      player.reset()

      expect(player.progress.value).toBe(0)
    })

    it('should reset isComplete to false', () => {
      const { quiz } = buildThreeQuestionQuiz()
      const player = useQuizPlayer(quiz)

      // Complete the quiz
      player.selectAnswer('a1-correct')
      player.submitAnswer()
      player.nextQuestion()
      player.selectAnswer('a2-correct')
      player.submitAnswer()
      player.nextQuestion()
      player.selectAnswer('a3-correct')
      player.submitAnswer()
      player.nextQuestion()

      expect(player.isComplete.value).toBe(true)

      player.reset()

      expect(player.isComplete.value).toBe(false)
    })
  })
})
