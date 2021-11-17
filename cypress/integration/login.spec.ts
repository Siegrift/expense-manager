describe('login', () => {
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

  it('is redirected to /add after logging in', () => {
    cy.visit('/login')
    cy.findAllByText('Sign in with Google', { timeout: 1500 }).should('exist')
    cy.cypressFirebaseLogin(Cypress.env('testUid'))

    cy.location('pathname').should('equal', '/add')
  })

  it('should not show scrollbar in any resolution', () => {
    cy.visit('/login')
    cy.findAllByText('Sign in with Google')

    const checkPage = () => {
      cy.document().then((doc) => {
        cy.wrap(doc.documentElement.scrollHeight).should('not.be.above', doc.documentElement.clientHeight)
      })
    }

    checkPage()
    cy.viewport(360, 600)
    checkPage()
  })
})
