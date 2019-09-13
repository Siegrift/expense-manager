import { INDEX_PAGE_REDIRECT } from '../lib/constants'
import { useRequireLoginEffect } from '../lib/shared/hooks'
import Loading from '../lib/shared/Loading'

/**
 * We want to show add expense screen on smaller devices and dashboard on larger
 * and display login screen if user is NOT signed in.
 */
const IndexPage = () => {
  // Firebase is loaded asynchronously and there is no user at the beginning.
  // We don't want to present user with flashing screen though...
  useRequireLoginEffect(INDEX_PAGE_REDIRECT)

  return (
    <Loading
      imageStyle={{ marginTop: '20vh', width: '60vw' }}
      text="Loading..."
    />
  )
}

export default IndexPage
