import { GetServerSideProps } from 'next'

import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'
import Tags from '../../lib/tags'

export default Tags

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
