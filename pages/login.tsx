import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'

import { PROJECT_TITLE } from '../lib/constants'
import { signIn } from '../lib/firebase/util'
import { useRequireLoginEffect } from '../lib/shared/hooks'

const Login = () => {
  useRequireLoginEffect()

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
        onClick={signIn}
        style={{ margin: 'auto', marginTop: '30vh' }}
      />
    </>
  )
}

export default Login
