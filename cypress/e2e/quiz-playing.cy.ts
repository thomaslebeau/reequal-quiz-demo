describe('Quiz Playing Flow', () => {
  const seedQuiz = {
    id: 'e2e-quiz-1',
    title: 'E2E Test Quiz',
    questions: [
      {
        id: 'q1',
        text: 'What color is the sky?',
        answers: [
          { id: 'q1-a1', text: 'Green', isCorrect: false },
          { id: 'q1-a2', text: 'Blue', isCorrect: true },
        ],
      },
      {
        id: 'q2',
        text: 'What is 2 + 2?',
        answers: [
          { id: 'q2-a1', text: '4', isCorrect: true },
          { id: 'q2-a2', text: '5', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        text: 'Which planet is closest to the Sun?',
        answers: [
          { id: 'q3-a1', text: 'Venus', isCorrect: false },
          { id: 'q3-a2', text: 'Mercury', isCorrect: true },
        ],
      },
    ],
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
  }

  function seedStore () {
    cy.window().then((win: any) => {
      const store = win.__quizStore__
      // Dates need to be rehydrated from plain object
      store.addQuiz({
        ...seedQuiz,
        createdAt: new Date(seedQuiz.createdAt),
        updatedAt: new Date(seedQuiz.updatedAt),
      })
    })
  }

  beforeEach(() => {
    cy.visit('/')
    // Wait for the app to fully render
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
    seedStore()
    // Wait for the seeded quiz to appear in the DOM
    cy.contains('E2E Test Quiz')
  })

  it('should show the seeded quiz in the list', () => {
    cy.contains('E2E Test Quiz')
    cy.contains('3 questions')
  })

  it('should start the quiz from the list', () => {
    cy.get('[data-testid="play-btn"]').first().click()
    cy.url().should('include', '/quiz/e2e-quiz-1/play')
    cy.contains('E2E Test Quiz')
  })

  it('should display the first question', () => {
    cy.get('[data-testid="play-btn"]').first().click()

    cy.contains('What color is the sky?', { timeout: 10_000 })
    cy.contains('1 / 3')
    cy.get('[data-testid="confirm-btn"]').should('be.disabled')
  })

  it('should play through the entire quiz with all correct answers', () => {
    cy.get('[data-testid="play-btn"]').first().click()

    // Question 1: "What color is the sky?" — correct is Blue (index 1)
    cy.contains('What color is the sky?', { timeout: 10_000 })
    cy.get('[data-testid="answer-option-1"]').click()
    cy.get('[data-testid="confirm-btn"]').should('not.be.disabled')
    cy.get('[data-testid="confirm-btn"]').click()

    // Feedback: correct
    cy.get('[data-testid="feedback-correct"]').should('be.visible')
    cy.get('[data-testid="next-btn"]').click()

    // Question 2: "What is 2 + 2?" — correct is 4 (index 0)
    cy.contains('What is 2 + 2?')
    cy.contains('2 / 3')
    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()

    cy.get('[data-testid="feedback-correct"]').should('be.visible')
    cy.get('[data-testid="next-btn"]').click()

    // Question 3: "Which planet is closest to the Sun?" — correct is Mercury (index 1)
    cy.contains('Which planet is closest to the Sun?')
    cy.contains('3 / 3')
    cy.get('[data-testid="answer-option-1"]').click()
    cy.get('[data-testid="confirm-btn"]').click()

    cy.get('[data-testid="feedback-correct"]').should('be.visible')
    cy.get('[data-testid="next-btn"]').click()

    // Score screen
    cy.get('[data-testid="score-screen"]').should('be.visible')
    cy.contains('3 / 3')
    cy.contains('100%')
    cy.contains('Great job')
  })

  it('should show incorrect feedback for wrong answers', () => {
    cy.get('[data-testid="play-btn"]').first().click()

    // Question 1: pick wrong answer (Green, index 0)
    cy.contains('What color is the sky?', { timeout: 10_000 })
    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()

    cy.get('[data-testid="feedback-incorrect"]').should('be.visible')
  })

  it('should play through with mixed results and show score', () => {
    cy.get('[data-testid="play-btn"]').first().click()
    cy.contains('What color is the sky?', { timeout: 10_000 })

    // Q1: Wrong answer (Green)
    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    // Q2: Correct answer (4)
    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    // Q3: Wrong answer (Venus)
    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    // Score screen: 1/3 correct
    cy.get('[data-testid="score-screen"]').should('be.visible')
    cy.contains('1 / 3')
    cy.contains('33%')
    cy.contains('Keep practicing')

    // Recap should show all 3 questions
    cy.get('[data-testid="recap-item-0"]').should('be.visible')
    cy.get('[data-testid="recap-item-1"]').should('be.visible')
    cy.get('[data-testid="recap-item-2"]').should('be.visible')
  })

  it('should return to the list when play again is clicked', () => {
    cy.get('[data-testid="play-btn"]').first().click()
    cy.contains('What color is the sky?', { timeout: 10_000 })

    // Speed through: answer all 3 questions
    cy.get('[data-testid="answer-option-1"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    cy.get('[data-testid="answer-option-0"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    cy.get('[data-testid="answer-option-1"]').click()
    cy.get('[data-testid="confirm-btn"]').click()
    cy.get('[data-testid="next-btn"]').click()

    // Score screen — click play again
    cy.get('[data-testid="play-again-btn"]').click()

    // Should navigate back to the quiz list
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
    cy.url().should('match', /\/$/)
  })

  it('should navigate back via back button during play', () => {
    cy.get('[data-testid="play-btn"]').first().click()
    cy.get('[data-testid="back-btn"]', { timeout: 10_000 }).should('be.visible')

    cy.get('[data-testid="back-btn"]').click()
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
    cy.url().should('match', /\/$/)
  })
})
