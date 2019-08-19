export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  isSigned: boolean
  messages: any
}

const state: State = {
  cnt: 0,
  isSigned: false,
  messages: {},
}

export const getInitialState = () => state
