import Router from 'next/router'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { State } from '../state'
import { redirectTo } from '../utils'

export function useRedirectIfNotSignedIn(delay = 2000) {
  const signInStatus = useSelector((state: State) => state.signInStatus)
  // https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isSignedRef = useRef(signInStatus)
  isSignedRef.current = signInStatus

  const wrappedRedirect = () => {
    const currentRoute = Router.pathname
    if (isSignedRef.current !== 'loggedIn' && currentRoute !== '/login') {
      redirectTo('/login')
    }
  }

  useEffect(() => {
    if (delay > 0) {
      setTimeout(wrappedRedirect, delay)
    } else {
      wrappedRedirect()
    }
  })

  return signInStatus
}
