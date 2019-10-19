import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import configureStore from 'redux-mock-store'

import { State } from './state'
import theme from './theme'

export const reduxify = (
  Component: () => JSX.Element,
  initialState: Partial<State>,
) => {
  const store = configureStore()(initialState)
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
