import React, { useEffect } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import { LocalizationProvider } from '@material-ui/pickers'
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns'
import { ThemeProvider } from '@material-ui/styles'
import App from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'

import { setCurrentScreen } from '../lib/actions'
import { initializeFirebase } from '../lib/firebase/firebase'
import { configureStore } from '../lib/redux/configureStore'
import { PROJECT_TITLE, BACKGROUND_COLOR } from '../lib/shared/constants'
import { ScreenTitle } from '../lib/state'
import theme from '../lib/theme'

const store = configureStore()

const ComponentWithCorrectScreen: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setCurrentScreen(Router.pathname.substring(1) as ScreenTitle))
  })

  return <>{children}</>
}

class ExpenseManagerApp extends App {
  async componentDidMount() {
    return await initializeFirebase(store)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <React.StrictMode>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={DateFnsUtils}>
              <Head>
                {/* https://github.com/zeit/next.js/blob/master/errors/no-document-title.md */}
                <title>{PROJECT_TITLE}</title>
              </Head>
              <CssBaseline />
              {/* Custom global styles */}
              <style>
                {`
                body {
                  background-color: ${BACKGROUND_COLOR} !important;
                  /* Disables pull-to-refresh but allows overscroll glow effects. */
                  overscroll-behavior-y: contain;
                }
              `}
              </style>
              <ComponentWithCorrectScreen>
                <Component {...pageProps} />
              </ComponentWithCorrectScreen>
            </LocalizationProvider>
          </ThemeProvider>
        </ReduxProvider>
      </React.StrictMode>
    )
  }
}

export default ExpenseManagerApp
