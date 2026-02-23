describe('Quiz Creation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the app to fully render
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
  })

  it('should show the empty state on first visit', () => {
    cy.get('[data-testid="empty-state"]').should('be.visible')
    cy.contains('No quizzes yet')
  })

  it('should navigate to the create quiz page', () => {
    cy.get('[data-testid="create-quiz-btn"]').should('be.visible').click()
    cy.url().should('include', '/quiz/new')
    cy.contains('New Quiz')
  })

  it('should create a complete quiz and see it in the list', () => {
    // Navigate to create and wait for editor to render
    cy.get('[data-testid="create-quiz-btn"]').click()
    cy.get('[data-testid="quiz-title"]', { timeout: 10_000 }).should('be.visible')

    // Fill quiz title
    cy.get('[data-testid="quiz-title"] input').type('Geography Quiz')

    // Fill question 1 text
    cy.get('[data-testid="question-text"] input').first().clear().type('What is the capital of France?')

    // Fill question 1 answers
    cy.get('[data-testid="answer-text-0"] input').first().type('Berlin')
    cy.get('[data-testid="answer-text-1"] input').first().type('Paris')

    // Mark answer 2 as correct (index 1)
    cy.get('[data-testid="correct-toggle-1"]').first().click()

    // Add question 2
    cy.get('[data-testid="add-question-btn"]').first().click()

    // Fill question 2 text (second question editor)
    cy.get('[data-testid="question-text"] input').eq(1).clear().type('What is the largest ocean?')

    // Fill question 2 answers
    cy.get('[data-testid="answer-text-0"] input').eq(1).type('Atlantic')
    cy.get('[data-testid="answer-text-1"] input').eq(1).type('Pacific')

    // Mark answer 2 as correct for question 2
    cy.get('[data-testid="correct-toggle-1"]').eq(1).click()

    // Save the quiz
    cy.get('[data-testid="save-btn"]').click()

    // Should navigate back to the list
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
    cy.url().should('match', /\/$/)

    // Verify the quiz appears in the list
    cy.contains('Geography Quiz')
    cy.get('[data-testid="empty-state"]').should('not.exist')

    // Verify the quiz card shows question count
    cy.contains('2 questions')
  })

  it('should validate required fields before saving', () => {
    cy.get('[data-testid="create-quiz-btn"]').click()
    cy.get('[data-testid="save-btn"]', { timeout: 10_000 }).should('be.visible')

    // Try to save with empty title
    cy.get('[data-testid="save-btn"]').click()

    // Should stay on the editor page
    cy.url().should('include', '/quiz/new')

    // Should show validation error
    cy.contains('Quiz title is required')
  })

  it('should add and remove answers within a question', () => {
    cy.get('[data-testid="create-quiz-btn"]').click()
    cy.get('[data-testid="quiz-title"]', { timeout: 10_000 }).should('be.visible')

    // Default question has 2 answers
    cy.get('[data-testid^="answer-text-"]').should('have.length', 2)

    // Add a third answer
    cy.get('[data-testid="add-answer-btn"]').click()
    cy.get('[data-testid^="answer-text-"]').should('have.length', 3)

    // Remove the third answer
    cy.get('[data-testid="remove-answer-2"]').click()
    cy.get('[data-testid^="answer-text-"]').should('have.length', 2)
  })

  it('should add and remove questions', () => {
    cy.get('[data-testid="create-quiz-btn"]').click()
    cy.get('[data-testid="quiz-title"]', { timeout: 10_000 }).should('be.visible')

    // Default: 1 question
    cy.get('[data-testid^="question-editor-"]').should('have.length', 1)

    // Add question
    cy.get('[data-testid="add-question-btn"]').last().click()
    cy.get('[data-testid^="question-editor-"]').should('have.length', 2)

    // Remove question (first one, index 0)
    cy.get('[data-testid="remove-question-0"]').click()
    cy.get('[data-testid^="question-editor-"]').should('have.length', 1)
  })

  it('should navigate back to list via back button without saving', () => {
    cy.get('[data-testid="create-quiz-btn"]').click()
    cy.get('[data-testid="back-btn"]', { timeout: 10_000 }).should('be.visible')

    cy.get('[data-testid="back-btn"]').click()
    cy.contains('h1', 'Quizzes', { timeout: 10_000 })
    cy.url().should('match', /\/$/)

    // Empty state should still show (nothing was saved)
    cy.get('[data-testid="empty-state"]').should('be.visible')
  })
})
