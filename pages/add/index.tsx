import AddTransactionScreen from '../../lib/addTransaction'
import { GetServerSideProps } from 'next'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default AddTransactionScreen

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
