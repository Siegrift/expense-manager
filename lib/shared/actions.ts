import { set } from '@siegrift/tsfunct'
import { ThunkDispatch } from 'redux-thunk'

import { Action } from '../redux/types'
import { NotificationState } from '../state'

// these two methods are the most common usage of notifications
export const createErrorNotification = (
  message: string,
): NotificationState => ({ severity: 'error', message })
export const createSuccessNotification = (
  message: string,
): NotificationState => ({ severity: 'success', message })

export const setSnackbarNotification = (
  notification: NotificationState | null,
  err?: Error | string,
): Action<any> => ({
  type: 'Set app error',
  payload: { notification, err },
  reducer: (state) => set(state, ['notification'], notification),
})

// not really an action, just a small utility
export const withErrorHandler = (
  message: string | null,
  dispatch: ThunkDispatch<any, any, any>,
  cb: () => void,
) => {
  try {
    cb()
    return true
  } catch (err) {
    dispatch(
      setSnackbarNotification(createErrorNotification(message ?? ''), err),
    )
    return false
  }
}
