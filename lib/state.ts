export type ScreenTitle = 'add' | 'transactions' | 'settings'

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  isSigned: boolean
  messages: any
  currentScreen: ScreenTitle
}

const state: State = {
  cnt: 0,
  isSigned: false,
  messages: {},
  currentScreen: 'add',
}

export const getInitialState = () => state
