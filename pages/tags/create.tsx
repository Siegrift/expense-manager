import CreateTagScreen from '../../lib/tags/createTagScreen'
import { GetServerSideProps } from 'next'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default CreateTagScreen

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
