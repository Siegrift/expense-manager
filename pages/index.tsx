import Router from 'next/router'

import WithSignedUser from '../lib/components/withSignedUser'

import AddTransaction from './add'

/**
 * We want to show add expense screen on smaller devices and dashboard on larger
 * and display login screen if user is NOT signed in.
 */
const IndexPage = () => {
  Router.push('/add')

  return (
    <WithSignedUser>
      <AddTransaction />
    </WithSignedUser>
  )
}

export default IndexPage
