import type { Quiz } from '@/types/quiz'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizStore } from './quizStore'

function createTestQuiz (overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-1',
    title: 'Test Quiz',
    questions: [],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

describe('quizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addQuiz', () => {
    it('should add a quiz to the store when called with a valid quiz', () => {
      const store = useQuizStore()
      const quiz = createTestQuiz()

      store.addQuiz(quiz)

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]).toEqual(quiz)
    })

    it('should increment quizCount when a quiz is added', () => {
      const store = useQuizStore()

      expect(store.quizCount).toBe(0)
      store.addQuiz(createTestQuiz())
      expect(store.quizCount).toBe(1)
    })

    it('should add multiple quizzes when called multiple times', () => {
      const store = useQuizStore()

      store.addQuiz(createTestQuiz({ id: 'quiz-1' }))
      store.addQuiz(createTestQuiz({ id: 'quiz-2', title: 'Second Quiz' }))

      expect(store.quizzes).toHaveLength(2)
      expect(store.quizCount).toBe(2)
    })
  })

  describe('getQuizById', () => {
    it('should return the quiz when it exists in the store', () => {
      const store = useQuizStore()
      const quiz = createTestQuiz({ id: 'abc-123' })
      store.addQuiz(quiz)

      const found = store.getQuizById('abc-123')

      expect(found).toEqual(quiz)
    })

    it('should return undefined when no quiz matches the id', () => {
      const store = useQuizStore()
      store.addQuiz(createTestQuiz({ id: 'quiz-1' }))

      const found = store.getQuizById('nonexistent')

      expect(found).toBeUndefined()
    })

    it('should return the correct quiz when multiple quizzes exist', () => {
      const store = useQuizStore()
      const target = createTestQuiz({ id: 'target', title: 'Target Quiz' })
      store.addQuiz(createTestQuiz({ id: 'other', title: 'Other Quiz' }))
      store.addQuiz(target)

      const found = store.getQuizById('target')

      expect(found).toBeDefined()
      expect(found!.title).toBe('Target Quiz')
    })
  })

  describe('deleteQuiz', () => {
    it('should remove the quiz from the store when it exists', () => {
      const store = useQuizStore()
      store.addQuiz(createTestQuiz({ id: 'to-delete' }))

      store.deleteQuiz('to-delete')

      expect(store.quizzes).toHaveLength(0)
    })

    it('should decrement quizCount when a quiz is deleted', () => {
      const store = useQuizStore()
      store.addQuiz(createTestQuiz({ id: 'quiz-1' }))
      store.addQuiz(createTestQuiz({ id: 'quiz-2' }))

      store.deleteQuiz('quiz-1')

      expect(store.quizCount).toBe(1)
    })

    it('should not affect other quizzes when deleting one', () => {
      const store = useQuizStore()
      const keeper = createTestQuiz({ id: 'keep', title: 'Keep Me' })
      store.addQuiz(createTestQuiz({ id: 'remove' }))
      store.addQuiz(keeper)

      store.deleteQuiz('remove')

      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0]!.id).toBe('keep')
    })

    it('should not throw when deleting a nonexistent quiz', () => {
      const store = useQuizStore()
      store.addQuiz(createTestQuiz())

      expect(() => store.deleteQuiz('nonexistent')).not.toThrow()
      expect(store.quizzes).toHaveLength(1)
    })
  })
})
