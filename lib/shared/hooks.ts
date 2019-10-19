import Router from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { State } from '../state'

import { redirectTo } from './utils'

export function useRedirectIfNotSignedIn() {
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

  return signInStatus
}
