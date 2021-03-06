import { Action as ReduxAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { State } from '../state'
import { Logger } from '../types'

export interface ThunkExtraArgument {
  logger: Logger
}

export interface Action<Payload = void> extends ReduxAction<string> {
  loggable?: boolean
  payload?: Payload
  reducer: (state: State) => State
}

export type Thunk<Result = Promise<unknown>> = ThunkAction<Result, State, ThunkExtraArgument, Action<unknown>>
