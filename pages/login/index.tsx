import Login from '../../lib/components/login'
import { GetServerSideProps } from 'next'
import { redirect } from '../../lib/server/utils'

export default Login

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.headers.cookie) redirect(res, '/add')
  return { props: {} }
}
