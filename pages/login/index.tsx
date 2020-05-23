import Login from '../../lib/components/login'
import { GetServerSideProps } from 'next'
import { redirect } from '../../lib/server/utils'
import { getSignInToken } from '../../lib/server/utils'

export default Login

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if ((await getSignInToken(req, res)) !== null) {
    redirect(res, '/add')
  }
  return { props: {} }
}
