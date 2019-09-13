import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import { configureStore } from '../lib/redux/configureStore'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider as ReduxProvider } from 'react-redux'
import theme from '../lib/theme'
import Head from 'next/head'
import { PROJECT_TITLE } from '../lib/constants'
import { initializeFirebase } from '../lib/firebase/firebase'

const store = configureStore()
initializeFirebase(store)

class ExpenseManagerApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </ReduxProvider>
      </Provider>
    )
  }
}

export default ExpenseManagerApp
