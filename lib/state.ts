export interface State {cnt: number}

const state: State = {
  cnt: 0,
}

export const getInitialState = () => state
