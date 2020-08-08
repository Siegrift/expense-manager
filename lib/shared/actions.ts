import { set } from '@siegrift/tsfunct'
import { ThunkDispatch } from 'redux-thunk'

import { Action } from '../redux/types'

export const setAppError = (
  message: string | null,
  err?: Error,
): Action<any> => ({
  type: 'Set app error',
  payload: { message, err },
  reducer: (state) => set(state, ['error'], message),
})

export const withErrorHandler = (
  message: string | null,
  dispatch: ThunkDispatch<any, any, any>,
  cb: () => void,
) => {
  try {
    cb()
  } catch (err) {
    dispatch(setAppError(message, err))
  }
}
