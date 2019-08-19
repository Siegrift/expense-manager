import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import { configureStore } from '../lib/redux/configureStore'
import Counter from '../lib/counter'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider as ReduxProvider, useSelector } from 'react-redux'
import theme from '../lib/theme'
import Head from 'next/head'
import { PROJECT_TITLE } from '../lib/constants'
import { initializeFirebase } from '../lib/firebase/firebase'
import * as firebase from 'firebase/app'
import { State } from '../lib/state'

const store = configureStore()
initializeFirebase(store)

// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut()
}

function authStateObserver(user: any) {
  console.log(user)
}

firebase.auth().onAuthStateChanged(authStateObserver)

const updateMess = (text: any) => () => {
  // Add a new message entry to the Firebase database.
  return firebase
    .firestore()
    .collection('messages')
    .add({
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function(error) {
      console.error('Error writing new message to Firebase Database', error)
    })
}

const Home = () => {
  const [mess, updMess] = useState('')

  return (
    <div>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <Head>
            {/* https://github.com/zeit/next.js/blob/master/errors/no-document-title.md */}
            <title>{PROJECT_TITLE}</title>
          </Head>
          <CssBaseline />
          <Counter />
          <button onClick={signIn}>google sign in</button>
          <button onClick={signOut}>google sign out</button>
          <input
            type="text"
            value={mess}
            onChange={(e) => updMess(e.target.value)}
          />
          <button onClick={updateMess(mess)}>update message</button>
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
}

export default Home
