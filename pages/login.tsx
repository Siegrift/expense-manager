import Typography from '@material-ui/core/Typography'
import Router from 'next/router'
import GoogleButton from 'react-google-button'
import { useDispatch } from 'react-redux'

import { PROJECT_TITLE } from '../lib/constants'
import { authChangeAction } from '../lib/firebase/actions'
import { signIn } from '../lib/firebase/util'
import { useRedirectIfNotSignedIn } from '../lib/shared/hooks'
import { LoadingScreen } from '../lib/shared/Loading'

import AddTransaction from './add'

const Login = () => {
  const dispatch = useDispatch()
  const signInStatus = useRedirectIfNotSignedIn()
  switch (signInStatus) {
    case 'loggedIn':
      Router.push('/add')
      return <AddTransaction />
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
              width: `60vw`,
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
              dispatch(authChangeAction('loggingIn'))
              signIn()
            }}
            style={{ margin: 'auto', marginTop: '30vh' }}
          />
        </>
      )
  }
}

export default Login
