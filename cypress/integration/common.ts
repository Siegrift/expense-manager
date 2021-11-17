import firebase from 'firebase/app'
import 'firebase/firestore'

export const initializeFixtures = () => {
  cy.fixture('tags').then((tags) => {
    tags.forEach((tag: any) => {
      cy.callFirestore('set', `tags/${tag.id}`, tag)
    })
  })

  cy.fixture('transactions').then((transactions) => {
    transactions.forEach((tx: any) => {
      cy.callFirestore('set', `transactions/${tx.id}`, {
        ...tx,
        dateTime: firebase.firestore.Timestamp.fromDate(new Date(tx.dateTime)),
      })
    })
  })
}
