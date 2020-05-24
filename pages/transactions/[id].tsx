import { GetServerSideProps } from 'next'

import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'
import EditTransaction from '../../lib/transactions/editTransaction'

export default EditTransaction

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
