// Global Cypress support file for e2e tests

// Clear localStorage between tests to ensure clean state
beforeEach(() => {
  cy.clearLocalStorage()
})
