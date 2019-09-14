import { set } from '@siegrift/tsfunct'

import { Action, Thunk } from './redux/types'
import { ScreenTitle } from './state'

export const updateCnt = (): Action => ({
  type: 'Update cnt',
  reducer: (state) => ({ ...state, cnt: state.cnt + 1 }),
})

export const thunk = (): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Waiting')
  await new Promise((res) => setTimeout(res, 1000))
  logger.log('End')
  dispatch(updateCnt())
  console.log(getState())
}

export const setCurrentScreen = (screen: ScreenTitle): Action<ScreenTitle> => ({
  type: 'Set current screen',
  payload: screen,
  reducer: (state) => set(state, ['currentScreen'], screen),
})
