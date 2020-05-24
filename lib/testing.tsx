import React from 'react'

import { LocalizationProvider } from '@material-ui/pickers'
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns'
import { ThemeProvider } from '@material-ui/styles'
import firebasemock from 'firebase-mock'
import { Provider as ReduxProvider } from 'react-redux'
import { Store, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import { TestApi } from './api'
import rootReducer from './redux/rootReducer'
import { State, getInitialState } from './state'
import theme from './theme'

export const reduxify = (Component: React.FC, store: Store) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <Component />
        </LocalizationProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}
// TODO: maybe move this to the files alongside real impl.
export const configureTestStore = (
  state: Partial<State> = getInitialState(),
) => {
  const logger = { log: () => null }
  const thunkExtra = {
    logger,
    api: new TestApi(logger),
  }
  const middlewares = [thunk.withExtraArgument(thunkExtra)]
  const store = createStore<State, any, unknown, unknown>(
    rootReducer as any,
    state as any,
    applyMiddleware(...middlewares),
  )

  return store
}

export const byAriaLabel = (value: string) => `[aria-label="${value}"]`

type ExtendedGlobal = NodeJS.Global & { mockFirebase: firebase.app.App }

export const initializeMockFirebase = () => {
  const mockauth = new firebasemock.MockAuthentication()
  mockauth.currentUser = { uid: 'mockedUserId' }
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
  const firebase = mockSdk.initializeApp()
  ;((global as any) as ExtendedGlobal).mockFirebase = firebase
  return firebase
}

export const getMockedFirebase = () => {
  const g = (global as any) as ExtendedGlobal
  if (!g.mockFirebase) {
    throw new Error(
      'Mock firebase is not present. Be sure to mock it first using "initializeMockFirebase"',
    )
  } else {
    return g.mockFirebase
  }
}
