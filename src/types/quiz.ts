export interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  answers: Answer[]
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

export interface QuestionResult {
  questionText: string
  correct: boolean
  selectedAnswerText: string
  correctAnswerText: string
}
