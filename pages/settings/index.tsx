import { GetServerSideProps } from 'next'

import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'
import Settings from '../../lib/settings'

export default Settings

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
