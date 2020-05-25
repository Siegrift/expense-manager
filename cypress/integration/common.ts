/// <reference types="cypress" />

export const createTransactions = () => {
  cy.fixture('tags').then((tags) => {
    tags.forEach((tag) => {
      cy.callFirestore('set', `tags/${tag.id}`, tag)
    })
  })

  // NOTE: doesn't work as the date time is not saved as Date, but string
  // cy.fixture('transactions').then((transactions) => {
  //   transactions.forEach((tx) => {
  //     console.log({
  //       ...tx,
  //       dateTime: new Date(tx.dateTime),
  //     })
  //     cy.callFirestore('set', `abc/${tx.id}`, tx)
  //   })
  // })
  cy.visit('/')
  cy.contains('Add transaction').should('be.visible')
  // TODO: firebase might not be loaded yet
  // eslint-disable-next-line
  cy.wait(1500)
  cy.dataCy('tag-field-wrapper').find('input').focus()
  cy.focused().type('A')
  cy.findByText('AAA').click()
  cy.focused().type('B')
  cy.findByText('BBB').click()
  cy.focused().tab()
  cy.focused().type('16.4').tab().tab()
  cy.focused().type('Test note')
  cy.focused().type('{enter}')
}
