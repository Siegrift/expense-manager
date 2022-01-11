import { useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'
import { useDispatch, useSelector } from 'react-redux'

import { authChangeAction } from '../firebase/actions'
import { signIn, signInWithEmailAndPassword, signUpWithEmailAndPassword } from '../firebase/util'
import { PROJECT_TITLE } from '../shared/constants'
import { redirectTo } from '../shared/utils'
import { State } from '../state'

import { LoadingScreen } from './loading'

const useStyles = makeStyles((theme: Theme) => ({
  signInButton: {
    display: 'flex',
    flexDirection: 'column',
    width: 240,
    margin: 'auto',
  },
  orText: {
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

interface SignInDialogProps {
  open: boolean
  setOpen: (newValue: boolean) => void
}

const SignInDialog = (props: SignInDialogProps) => {
  const { open, setOpen } = props
  const [action, setAction] = useState('Sign in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleClose = () => {
    setOpen(false)
    setAction('Sign in')
  }
  const handleAction = async () => {
    try {
      if (action === 'Sign in') {
        await signInWithEmailAndPassword(email, password)
      } else {
        await signUpWithEmailAndPassword(email, password)
      }
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{action}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAction()
            }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAction()
            }}
          />
          <Link
            component="button"
            variant="body2"
            onClick={() => setAction(action === 'Sign in' ? 'Sign up' : 'Sign in')}
          >
            {action === 'Sign in' ? 'or create a new account' : 'or sign in with an existing account'}
          </Link>
          {errorMessage !== '' && (
            <Typography color="error" style={{ marginTop: 16 }} variant="body2">
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary">
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Login = () => {
  const dispatch = useDispatch()
  const signInStatus = useSelector((state: State) => state.signInStatus)
  const [open, setOpen] = useState(false)
  const classes = useStyles()

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

          <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginTop: '5vh' }}>
            {PROJECT_TITLE}
          </Typography>

          <GoogleButton
            onClick={async () => {
              await dispatch(authChangeAction('loggingIn', null))
              signIn()
            }}
            style={{ margin: 'auto', marginTop: '10vh' }}
          />

          <div className={classes.signInButton}>
            <p className={classes.orText}>Or</p>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Sign in using email
            </Button>
            <SignInDialog open={open} setOpen={setOpen} />
          </div>
        </>
      )
  }
}

export default Login
