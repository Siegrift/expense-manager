import Router from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { LoadingScreen } from '../components/loading'
import { redirectTo } from '../shared/utils'
import { State } from '../state'

const withSignedUser = (Component: React.FC): React.FC => {
  return () => {
    const signInStatus = useSelector((state: State) => state.signInStatus)
    useEffect(() => {
      if (
        signInStatus !== 'unknown' &&
        signInStatus !== 'loggedIn' &&
        Router.pathname !== '/login' /* current route */
      ) {
        redirectTo('/login')
      }
    })

    if (signInStatus !== 'loggedIn') {
      return <LoadingScreen />
    } else {
      return <Component />
    }
  }
}

export default withSignedUser
