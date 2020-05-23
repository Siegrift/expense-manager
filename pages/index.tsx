import { GetServerSideProps } from 'next'
import { redirect, redirectToLoginIfNotSignedIn } from '../lib/server/utils'

// we have no landing page, redirect to /add
const IndexPage = () => null

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if ((await redirectToLoginIfNotSignedIn(req, res)) === null)
    return { props: {} }

  redirect(res, '/add')
  return { props: {} }
}

export default IndexPage
