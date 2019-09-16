import Router from 'next/router'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { State } from '../state'
import { redirectTo } from '../utils'

export function useRequireLoginEffect(delay = 0) {
  const isSigned = useSelector((state: State) => state.isSigned)
  // https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isSignedRef = useRef(isSigned)
  isSignedRef.current = isSigned

  const wrappedRedirect = () => {
    const currentRoute = Router.pathname
    if (isSignedRef.current && currentRoute !== '/main') {
      redirectTo('/main')
    } else if (currentRoute !== '/login') {
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
}
