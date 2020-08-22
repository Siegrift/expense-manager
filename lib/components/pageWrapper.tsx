import React from 'react'

import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { useSelector, useDispatch } from 'react-redux'

import Navigation from '../components/navigation'
import { setAppError } from '../shared/actions'
import { appErrorSel, signInStatusSel } from '../shared/selectors'
import { redirectTo } from '../shared/utils'

import ConfirmDialog from './confirmDialog'
import { LoadingOverlay } from './loading'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 'calc(100vh - 56px)',
    ['@media (max-height:500px)']: {
      height: 'calc(100vh)',
    },
    padding: theme.spacing(2),
    overflow: 'auto',
    overflowX: 'hidden',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
}))

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const classes = useStyles()
  const error = useSelector(appErrorSel)
  const signInStatus = useSelector(signInStatusSel)
  const dispatch = useDispatch()

  return (
    <>
      <Grid container className={classes.root}>
        {children}
        {error && (
          <Snackbar
            open={!!error}
            onClose={() => dispatch(setAppError(null))}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <Alert
              onClose={() => dispatch(setAppError(null))}
              severity="error"
              variant="filled"
            >
              {error}
            </Alert>
          </Snackbar>
        )}
      </Grid>
      {signInStatus === 'loggedOut' && (
        <ConfirmDialog
          onConfirm={() => redirectTo('/login')}
          title="Please sign in"
          open={true}
          ContentComponent={
            'You appear to be logged out. Redirect to login page?'
          }
        />
      )}
      {(signInStatus === 'loggingIn' || signInStatus === 'unknown') && (
        <LoadingOverlay />
      )}
      <Navigation />
    </>
  )
}

export default PageWrapper
