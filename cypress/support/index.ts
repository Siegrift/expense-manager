import '@testing-library/cypress/add-commands'
import 'cypress-plugin-tab'
import './commands'

beforeEach(() => {
  const removeTestData = (coll: string) => {
    cy.callFirestore('get', coll).then((data) => {
      if (!data) return
      const uid = Cypress.env('testUid')
      const filtered = data.filter((r: any) => r.uid === uid)
      filtered.forEach((f: any) => {
        cy.callFirestore('delete', `${coll}/${f.id}`)
      })
    })
  }

  removeTestData('transactions')
  removeTestData('tags')
})
