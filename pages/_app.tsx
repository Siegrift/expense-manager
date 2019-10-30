import DateFnsUtils from '@date-io/date-fns'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from '@material-ui/styles'
import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { initializeFirebase } from '../lib/firebase/firebase'
import { configureStore } from '../lib/redux/configureStore'
import { PROJECT_TITLE } from '../lib/shared/constants'
import theme from '../lib/theme'

const store = configureStore()
initializeFirebase(store)

class ExpenseManagerApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Head>
              {/* https://github.com/zeit/next.js/blob/master/errors/no-document-title.md */}
              <title>{PROJECT_TITLE}</title>
            </Head>
            <CssBaseline />
            {/* Custom global styles */}
            <style>
              {`
                body {
                  background-color: blanchedalmond !important;
                  /* Disables pull-to-refresh but allows overscroll glow effects. */
                  overscroll-behavior-y: contain;
                }
              `}
            </style>
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </ReduxProvider>
    )
  }
}

export default ExpenseManagerApp
