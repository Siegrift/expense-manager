import Router from 'next/router'

import { LoadingScreen } from '../lib/components/loading'
import { useRedirectIfNotSignedIn } from '../lib/shared/hooks'

import AddTransaction from './add'

/**
 * We want to show add expense screen on smaller devices and dashboard on larger
 * and display login screen if user is NOT signed in.
 */
const IndexPage = () => {
  // Firebase is loaded asynchronously and there is no user at the beginning.
  // We don't want to present user with flashing screen though...
  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    Router.push('/add')
    return <AddTransaction />
  }
}

export default IndexPage
