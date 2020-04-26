import EditTagScreen from '../../lib/tags/editTagScreen'
import { GetServerSideProps } from 'next'
import { redirectToLoginIfNotSignedIn } from '../../lib/server/utils'

export default EditTagScreen

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  redirectToLoginIfNotSignedIn(req, res)
  return { props: {} }
}
