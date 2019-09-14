import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import renderer from 'react-test-renderer'
import { Store } from 'redux'

import { configureStore } from '../lib/redux/configureStore'
import theme from '../lib/theme'
import Transactions from '../pages/transactions'

const wrapWithProviders = (Component, store) => {
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

describe('With Snapshot Testing', () => {
  let store: Store

  beforeEach(() => {
    store = configureStore()
  })

  it('renders transactions', () => {
    const component = renderer.create(wrapWithProviders(Transactions, store))
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
