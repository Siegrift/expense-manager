import { Action } from './redux/types'

export const updateCnt = (): Action => ({
  type: 'Update cnt',
  reducer: (state) => ({ ...state, cnt: state.cnt + 1 }),
})
