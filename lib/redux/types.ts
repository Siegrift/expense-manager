import { State } from '../state'
import { Action as ReduxAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Logger } from '../types'
import { Api } from '../api'

export interface ThunkExtraArgument {
  logger: Logger
  api: Api
}

export interface Action<Payload = void> extends ReduxAction<string> {
  loggable?: boolean
  payload?: Payload
  reducer: (state: State) => State
}

export type Thunk<Result = Promise<unknown>> = ThunkAction<
  Result,
  State,
  ThunkExtraArgument,
  Action<unknown>
>
