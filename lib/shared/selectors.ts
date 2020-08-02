import { State } from '../state'

export const currentUserIdSel = (state: State) => state.user?.uid ?? null
export const appErrorSel = (state: State) => state.error
