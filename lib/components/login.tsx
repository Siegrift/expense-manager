import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'
import { useDispatch, useSelector } from 'react-redux'

import { authChangeAction } from '../firebase/actions'
import { signIn } from '../firebase/util'
import { PROJECT_TITLE } from '../shared/constants'
import { redirectTo } from '../shared/utils'
import { State } from '../state'

import { LoadingScreen } from './loading'

const Login = () => {
  const dispatch = useDispatch()
  const signInStatus = useSelector((state: State) => state.signInStatus)

  if (signInStatus === 'loggedIn') {
    redirectTo('/add')
    return null
  }

  switch (signInStatus) {
    case 'unknown':
      return <LoadingScreen />
    case 'loggingIn':
      return <LoadingScreen text="Signing in..." />
    case 'loggedOut':
      return (
        <>
          <img
            src="../static/coin.svg"
            alt="coin"
            style={{
              width: `40vh`,
              margin: 'auto',
              marginTop: '10vh',
              display: 'block',
            }}
          />

          <Typography
            variant="h4"
            gutterBottom
            style={{ textAlign: 'center', marginTop: '5vh' }}
          >
            {PROJECT_TITLE}
          </Typography>

          <GoogleButton
            onClick={() => {
              dispatch(authChangeAction('loggingIn', null))
              signIn()
            }}
            style={{ margin: 'auto', marginTop: '15vh' }}
          />
        </>
      )
  }
}

export default Login
