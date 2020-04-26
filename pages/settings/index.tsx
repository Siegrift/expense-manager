import Settings from '../../lib/settings'
import { GetServerSideProps } from 'next'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default Settings

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
