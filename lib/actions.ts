import { Action, Thunk } from './redux/types'

export const updateCnt = (): Action => ({
  type: 'Update cnt',
  reducer: (state) => ({ ...state, cnt: state.cnt + 1 }),
})

export const thunk = (): Thunk => async (
  dispatch,
  getState,
  { logger, api },
) => {
  logger.log('Waiting')
  await new Promise((res) => setTimeout(res, 1000))
  logger.log('End')
  dispatch(updateCnt())
  console.log(getState())
}
