import Router from 'next/router'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../state'

export function useRequireLoginEffect(delay = 0) {
  const isSigned = useSelector((state: State) => state.isSigned)
  // https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isSignedRef = useRef(isSigned)
  isSignedRef.current = isSigned

  const redirect = () => {
    const currentRoute = Router.pathname
    if (isSignedRef.current && currentRoute !== '/addExpense') {
      Router.push('/addExpense')
    } else if (currentRoute !== '/login') {
      Router.push('/login')
    }
  }

  useEffect(() => {
    if (delay > 0) {
      setTimeout(redirect, delay)
    } else {
      redirect()
    }
  })
}
