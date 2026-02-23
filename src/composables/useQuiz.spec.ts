import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizStore } from '@/stores/quizStore'
import { useQuiz } from './useQuiz'

describe('useQuiz', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('createQuiz', () => {
    it('should return a quiz with the given title', () => {
      const { createQuiz } = useQuiz()

      const quiz = createQuiz('My Quiz')

      expect(quiz.title).toBe('My Quiz')
    })

    it('should return a quiz with a generated string id', () => {
      const { createQuiz } = useQuiz()

      const quiz = createQuiz('My Quiz')

      expect(quiz.id).toBeDefined()
      expect(typeof quiz.id).toBe('string')
      expect(quiz.id.length).toBeGreaterThan(0)
    })

    it('should return a quiz with an empty questions array', () => {
      const { createQuiz } = useQuiz()

      const quiz = createQuiz('My Quiz')

      expect(quiz.questions).toEqual([])
    })

    it('should return a quiz with createdAt and updatedAt dates', () => {
      const { createQuiz } = useQuiz()

      const before = new Date()
      const quiz = createQuiz('My Quiz')
      const after = new Date()

      expect(quiz.createdAt).toBeInstanceOf(Date)
      expect(quiz.updatedAt).toBeInstanceOf(Date)
      expect(quiz.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(quiz.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should generate unique ids across multiple calls', () => {
      const { createQuiz } = useQuiz()

      const quiz1 = createQuiz('First')
      const quiz2 = createQuiz('Second')

      expect(quiz1.id).not.toBe(quiz2.id)
    })

    it('should not add the quiz to the store', () => {
      const { createQuiz } = useQuiz()
      const store = useQuizStore()

      createQuiz('Pure Factory')

      expect(store.quizzes).toHaveLength(0)
    })
  })

  describe('createQuestion', () => {
    it('should return a question with the given text', () => {
      const { createQuestion } = useQuiz()

      const question = createQuestion('What is 2+2?')

      expect(question.text).toBe('What is 2+2?')
    })

    it('should return a question with a generated string id', () => {
      const { createQuestion } = useQuiz()

      const question = createQuestion('What is 2+2?')

      expect(question.id).toBeDefined()
      expect(typeof question.id).toBe('string')
      expect(question.id.length).toBeGreaterThan(0)
    })

    it('should return a question with an empty answers array', () => {
      const { createQuestion } = useQuiz()

      const question = createQuestion('What is 2+2?')

      expect(question.answers).toEqual([])
    })

    it('should generate unique ids across multiple calls', () => {
      const { createQuestion } = useQuiz()

      const q1 = createQuestion('First')
      const q2 = createQuestion('Second')

      expect(q1.id).not.toBe(q2.id)
    })
  })

  describe('createAnswer', () => {
    it('should return an answer with the given text', () => {
      const { createAnswer } = useQuiz()

      const answer = createAnswer('Four')

      expect(answer.text).toBe('Four')
    })

    it('should return an answer with a generated string id', () => {
      const { createAnswer } = useQuiz()

      const answer = createAnswer('Four')

      expect(answer.id).toBeDefined()
      expect(typeof answer.id).toBe('string')
      expect(answer.id.length).toBeGreaterThan(0)
    })

    it('should default isCorrect to false', () => {
      const { createAnswer } = useQuiz()

      const answer = createAnswer('Four')

      expect(answer.isCorrect).toBe(false)
    })

    it('should set isCorrect to true when specified', () => {
      const { createAnswer } = useQuiz()

      const answer = createAnswer('Four', true)

      expect(answer.isCorrect).toBe(true)
    })

    it('should generate unique ids across multiple calls', () => {
      const { createAnswer } = useQuiz()

      const a1 = createAnswer('A')
      const a2 = createAnswer('B')

      expect(a1.id).not.toBe(a2.id)
    })
  })

  describe('saveQuiz', () => {
    it('should add the quiz to the store', () => {
      const { createQuiz, saveQuiz } = useQuiz()
      const store = useQuizStore()

      const quiz = createQuiz('Saved Quiz')
      saveQuiz(quiz)

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]).toEqual(quiz)
    })

    it('should allow saving multiple quizzes', () => {
      const { createQuiz, saveQuiz } = useQuiz()
      const store = useQuizStore()

      saveQuiz(createQuiz('First'))
      saveQuiz(createQuiz('Second'))

      expect(store.quizzes).toHaveLength(2)
    })

    it('should make the quiz retrievable by id', () => {
      const { createQuiz, saveQuiz, getQuizById } = useQuiz()

      const quiz = createQuiz('Findable')
      saveQuiz(quiz)

      expect(getQuizById(quiz.id)).toEqual(quiz)
    })
  })

  describe('removeQuiz', () => {
    it('should remove the quiz from the store', () => {
      const { createQuiz, saveQuiz, removeQuiz } = useQuiz()
      const store = useQuizStore()

      const quiz = createQuiz('To Remove')
      saveQuiz(quiz)
      expect(store.quizzes).toHaveLength(1)

      removeQuiz(quiz.id)

      expect(store.quizzes).toHaveLength(0)
    })

    it('should only remove the targeted quiz', () => {
      const { createQuiz, saveQuiz, removeQuiz } = useQuiz()
      const store = useQuizStore()

      const keep = createQuiz('Keep')
      const remove = createQuiz('Remove')
      saveQuiz(keep)
      saveQuiz(remove)

      removeQuiz(remove.id)

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]!.id).toBe(keep.id)
    })

    it('should not throw when removing a nonexistent quiz', () => {
      const { removeQuiz } = useQuiz()

      expect(() => removeQuiz('nonexistent')).not.toThrow()
    })

    it('should decrement quizCount after removal', () => {
      const { createQuiz, saveQuiz, removeQuiz } = useQuiz()
      const store = useQuizStore()

      const quiz = createQuiz('Counted')
      saveQuiz(quiz)
      expect(store.quizCount).toBe(1)

      removeQuiz(quiz.id)

      expect(store.quizCount).toBe(0)
    })
  })
})
