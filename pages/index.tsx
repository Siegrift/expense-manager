import { GetServerSideProps } from 'next'

import { redirect } from '../lib/server/utils'

// we have no landing page, redirect to /add
const IndexPage = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  redirect(res, '/add')
  return { props: {} }
}

export default IndexPage
