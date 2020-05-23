/// <reference types="cypress" />

describe('login', () => {
  it('shows login page', () => {
    cy.visit('/')
    cy.findAllByText('Sign in with Google', { timeout: 1500 }).should('exist')
  })

  it('if signed in redirects to /add and shows form', () => {
    cy.login()

    cy.visit('/')
    cy.location('pathname').should('equal', '/add')
    cy.findByText('Add transaction')
  })

  it('if is not redirected to /add if navigated on specific url', () => {
    cy.login()

    cy.visit('/transactions')
    cy.location('pathname').should('equal', '/transactions')
  })
})
