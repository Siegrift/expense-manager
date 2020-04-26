// https://twitter.com/bahmutov/status/958772380834369536
/// <reference types="Cypress" />
import { BASE_URL } from './common'

describe('e2e', () => {
  it('opens a web page', () => {
    cy.visit(BASE_URL)
    cy.wait

    cy.findAllByText('Sign in with Google', { timeout: 500 }).should('exist')
  })
})
