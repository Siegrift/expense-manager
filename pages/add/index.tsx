import { GetServerSideProps } from 'next'

import AddTransactionScreen from '../../lib/addTransaction'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default AddTransactionScreen

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
