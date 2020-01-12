import { LoadingScreen } from '../lib/components/loading'
import { redirectTo } from '../lib/shared/utils'

/**
 * We want to show add expense screen on smaller devices and dashboard on larger
 * and display login screen if user is NOT signed in.
 */
const IndexPage = () => {
  // https://github.com/zeit/next.js/issues/2473#issuecomment-362119102
  if ((process as any).browser) {
    redirectTo('/add')
  }

  return <LoadingScreen />
}

export default IndexPage
