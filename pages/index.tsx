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
        <div className="wrapper">
          <img src="../static/coin.svg" alt="coin" className="image" />
        </div>
        <style jsx global>{`
          body {
            display: flex;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            justify-content: center;
            align-items: center;
          }

          .wrapper {
            border-radius: 8px;
            padding: 30px;
            border: 1px solid rgb(187, 184, 184);
            display: flex;
          }

          @keyframes rotation {
            from {
              transform: rotateY(0deg);
            }
            to {
              transform: rotateY(1800deg);
            }
          }

          .image {
            width: 150px;
            animation: rotation 2s infinite ease-in-out;
          }
        `}</style>
        <style jsx>{`
          h1,
          a {
            font-family: "Arial";
          }

          ul {
            padding: 0;
          }

          li {
            list-style: none;
            margin: 5px 0;
          }

          a {
            text-decoration: none;
            color: blue;
          }

          a:hover {
            opacity: 0.6;
          }
        `}</style>
      </ThemeProvider>
    </ReduxProvider>
  </div>
)

export default Home
