import DateFnsUtils from '@date-io/date-fns'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from '@material-ui/styles'
import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider } from 'react-redux'

import { PROJECT_TITLE } from '../lib/constants'
import { initializeFirebase } from '../lib/firebase/firebase'
import { configureStore } from '../lib/redux/configureStore'
import theme from '../lib/theme'

const store = configureStore()
initializeFirebase(store)

class ExpenseManagerApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Head>
                {/* https://github.com/zeit/next.js/blob/master/errors/no-document-title.md */}
                <title>{PROJECT_TITLE}</title>
              </Head>
              <CssBaseline />
              {/* Custom global styles */}
              <style jsx global>
                {`
                  body {
                    background-color: blanchedalmond !important;
                  }
                `}
              </style>
              <Component {...pageProps} />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </ReduxProvider>
      </Provider>
    )
  }
}

export default ExpenseManagerApp
