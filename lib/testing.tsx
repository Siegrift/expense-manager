import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from '@material-ui/styles'
// @ts-ignore FIXME: firebase-mock types
import firebasemock from 'firebase-mock'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Store } from 'redux'
import reduxMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { State } from './state'
import theme from './theme'

export const reduxify = (Component: () => JSX.Element, store: Store) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Component />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export const configureMockStore = (state: Partial<State>) => {
  return reduxMockStore([thunk])(state)
}

export const byAriaLabel = (value: string) => `[aria-label="${value}"]`

type ExtendedGlobal = NodeJS.Global & { mockFirebase: firebase.app.App }

export const initializeMockFirebase = () => {
  const mockauth = new firebasemock.MockAuthentication()
  mockauth.autoFlush()
  const mockfirestore = new firebasemock.MockFirestore()
  mockfirestore.autoFlush()
  const mockSdk = new firebasemock.MockFirebaseSdk(
    null, // realtime database
    () => mockauth,
    () => mockfirestore,
    null, // storage
    null, // messaging
  )
  const firebase = mockSdk.initializeApp();
  (global as ExtendedGlobal).mockFirebase = firebase
  return firebase
}

export const getMockedFirebase = () => {
  const g = global as ExtendedGlobal
  if (!g.mockFirebase) {
    throw new Error(
      'Mock firebase is not present. Be sure to mock it first using "initializeMockFirebase"',
    )
  } else {
    return g.mockFirebase
  }
}
