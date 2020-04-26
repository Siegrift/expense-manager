import Charts from '../../lib/charts'
import { GetServerSideProps } from 'next'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default Charts

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
