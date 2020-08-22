// this file cannot contain any imports/exports and is automatically picked up by TS.
// https://github.com/cypress-io/cypress/issues/1065#issuecomment-351769720
declare namespace Cypress {
  interface Chainable {
    dataCy(value: string): Chainable<Element>
    cypressFirebaseLogin(testUid: string): Chainable<unknown>
    logCurrentFirebaseUser(): Chainable<undefined>
  }
}
