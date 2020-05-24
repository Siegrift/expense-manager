import { GetServerSideProps } from 'next'

import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'
import CreateTagScreen from '../../lib/tags/createTagScreen'

export default CreateTagScreen

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
