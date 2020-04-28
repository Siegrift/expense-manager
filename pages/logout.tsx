import React from 'react'
import { getFirebase } from '../lib/firebase/firebase'
import Router from 'next/router'

async function signOut() {
  // Sign out of Firebase
  await getFirebase().auth().signOut()
  Router.push('/')
}

const Logout = () => {
  return (
    <div>
      <button onClick={signOut} aria-label="sign out">
        google sign out
      </button>
    </div>
  )
}

export default Logout
