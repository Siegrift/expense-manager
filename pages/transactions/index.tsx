import { GetServerSideProps } from 'next'

import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'
import Transactions from '../../lib/transactions'

export default Transactions

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
