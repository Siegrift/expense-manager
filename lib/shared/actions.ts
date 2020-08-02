import { set } from '@siegrift/tsfunct'

import { Action } from '../redux/types'

export const setAppError = (error: string | null): Action => ({
  type: 'Set app error',
  reducer: (state) => set(state, ['error'], error),
})
