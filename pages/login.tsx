import GoogleButton from 'react-google-button'
import { auth } from 'firebase/app'
import { State } from '../lib/state'
import Typography from '@material-ui/core/Typography'
import { PROJECT_TITLE } from '../lib/constants'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import { signIn } from '../lib/firebase/util'
import { useRequireLoginEffect } from '../lib/shared/hooks'

const Login = () => {
  useRequireLoginEffect()

  return (
    <>
      <img
        src="../static/coin.svg"
        alt="coin"
        style={{ width: `60vw`, margin: 'auto', marginTop: '10vh', display: 'block' }}
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
        style={{ margin: 'auto', marginTop: '15vh' }}
      />
      <Typography variant="subtitle1" style={{ marginTop: '3vh', textAlign: 'center' }}>
        or <Link href="/main"><a>continue without sign in</a></Link>
        <Tooltip title="Some features only available when signed in!" placement="top">
          <InfoOutlinedIcon style={{ color: '#0000EE', marginLeft: '5px', verticalAlign: 'middle' }} />
        </Tooltip>
      </Typography>
    </>
  )
}

export default Login
