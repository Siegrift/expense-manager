export interface State {
  cnt: number
  messages: any
}

const state: State = {
  cnt: 0,
  messages: {},
}

export const getInitialState = () => state
