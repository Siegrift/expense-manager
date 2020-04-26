import { GetServerSideProps } from 'next'
import { redirect, redirectToLoginIfNotSignedIn } from '../lib/server/utils'

// we have no landing page, redirect to /add
const IndexPage = () => null

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (!redirectToLoginIfNotSignedIn(req, res)) return { props: {} }

  redirect(res, '/add')
  return { props: {} }
}

export default IndexPage
