import React from 'react'
import Head from 'next/head'
import { Provider as ReduxProvider } from 'react-redux'
import { configureStore } from '../lib/redux/configureStore'
import Counter from '../lib/counter'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'

const store = configureStore()

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
    </Head>

    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Counter />
      </ThemeProvider>
    </ReduxProvider>
  </div>
)

export default Home
