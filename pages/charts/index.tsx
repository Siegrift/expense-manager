import { GetServerSideProps } from 'next'

import Charts from '../../lib/charts'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default Charts

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
