/// <reference types="cypress" />

import { login } from './common'

describe('login', () => {
  it('shows login page', () => {
    cy.visit('/')
    cy.findAllByText('Sign in with Google', { timeout: 1500 }).should('exist')
  })

  it('if signed in redirects to /add and shows form', () => {
    login()

    cy.visit('/')
    cy.location('pathname').should('equal', '/add')
    cy.findByText('Add transaction')
  })
})
