import React from 'react'

import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import classnames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import Navigation, { DRAWER_WIDTH } from '../components/navigation'
import { setSnackbarNotification } from '../shared/actions'
import { useIsVeryBigDevice } from '../shared/hooks'
import { snackbarNotificationSel, signInStatusSel } from '../shared/selectors'
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
  veryBigDeviceRoot: {
    height: '100%',
    left: `${DRAWER_WIDTH}px`,
    margin: 'auto',
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    position: 'absolute',
  },
}))

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const classes = useStyles()
  const notification = useSelector(snackbarNotificationSel)
  const signInStatus = useSelector(signInStatusSel)
  const veryBigDevice = useIsVeryBigDevice()
  const dispatch = useDispatch()

  return (
    <>
      <Grid
        container
        className={classnames(
          classes.root,
          veryBigDevice && classes.veryBigDeviceRoot,
        )}
      >
        {children}
        {notification && (
          <Snackbar
            autoHideDuration={3000} // hide after max 3s
            open={!!notification}
            onClose={(_, reason) =>
              dispatch(setSnackbarNotification(null, reason))
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <Alert
              onClose={() => dispatch(setSnackbarNotification(null))}
              severity={notification.severity}
              variant="filled"
            >
              {notification.message}
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
