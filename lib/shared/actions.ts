import { set } from '@siegrift/tsfunct'
import { ThunkDispatch } from 'redux-thunk'

import { Action } from '../redux/types'
import { ItemsExpanded, NotificationState } from '../state'

// these two methods are the most common usage of notifications
export const createErrorNotification = (message: string): NotificationState => ({ severity: 'error', message })
export const createSuccessNotification = (message: string): NotificationState => ({ severity: 'success', message })

export const setSnackbarNotification = (notification: NotificationState | null, err?: Error | string): Action<any> => ({
  type: 'Set snackbar notification',
  payload: { notification, err },
  reducer: (state) => set(state, ['notification'], notification),
})

// TODO: replace with awaited when TS
type PromiseVal<T> = T extends Promise<infer X> ? X : T

// not really an action, just a small utility
export const withErrorHandler = async <T>(
  message: string | null,
  dispatch: ThunkDispatch<any, any, any>,
  cb: () => T
): Promise<PromiseVal<T> | undefined> => {
  try {
    return (await cb()) as any
  } catch (err) {
    dispatch(setSnackbarNotification(createErrorNotification(message ?? ''), err as Error))
    return undefined
  }
}

export const changeNavigationExpanded = (expanded: ItemsExpanded): Action<ItemsExpanded> => ({
  type: 'Change navigation expansion',
  reducer: (state) => set(state, ['navigation', 'expanded'], expanded),
  payload: expanded,
})
