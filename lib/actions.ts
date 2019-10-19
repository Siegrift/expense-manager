import { set } from '@siegrift/tsfunct'

import { Action } from './redux/types'
import { ScreenTitle } from './state'

export const setCurrentScreen = (screen: ScreenTitle): Action<ScreenTitle> => ({
  type: 'Set current screen',
  payload: screen,
  reducer: (state) => set(state, ['currentScreen'], screen),
})
