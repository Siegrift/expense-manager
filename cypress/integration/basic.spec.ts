// https://twitter.com/bahmutov/status/958772380834369536
/// <reference types="Cypress" />

describe('e2e', () => {
  it('opens a web page', () => {
    cy.visit('/')
    cy.findAllByText('Sign in with Google', { timeout: 500 }).should('exist')
  })
})
