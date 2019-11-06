import { Tag, Transaction } from './addTransaction/state'
import { ObjectOf } from './types'

export type ScreenTitle =
  | 'add'
  | 'transactions'
  | 'charts'
  | 'tags'
  | 'settings'

export type SignInStatus = 'loggedIn' | 'loggingIn' | 'loggedOut' | 'unknown'

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  currentScreen: ScreenTitle
  tags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
}

const state: State = {
  cnt: 0,
  signInStatus: 'unknown',
  currentScreen: 'add',
  tags: {},
  transactions: {},
}

export const getInitialState = () => state
