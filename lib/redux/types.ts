import { State } from '../state'

export interface Action<Payload = void> {
  type: string
  loggable?: boolean
  payload?: Payload
  reducer: (state: State) => State
}
