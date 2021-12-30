Cypress.Commands.add('firebaseLogin', () => {
  cy.task('parseConfiguration').then((config: any) => {
    cy.login(config.FIREBASE_TEST_ACCOUNT_UID)
  })
})

Cypress.Commands.add('logCurrentFirebaseUser', (): any => {
  const user = firebase.auth().currentUser
  console.log('Current user', user)

  cy.log(JSON.stringify(user))
})

Cypress.Commands.add('dataCy', (value): any => {
  cy.get(`[data-cy=${value}]`)
})
