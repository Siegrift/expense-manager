import { BASE_URL } from './common'

describe('e2e', () => {
  it('opens a web page', () => {
    cy.visit(BASE_URL)
    cy.wait

    cy.queryAllByText('Sign in with Google', { timeout: 500 }).should('exist')
  })
})
