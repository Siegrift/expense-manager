import {
  createDefaultAddTransactionState,
  AddTransaction,
  Tag,
  Transaction
} from './addTransaction/state'
import { ObjectOf } from './types'

export type ScreenTitle = 'add' | 'transactions' | 'charts' | 'settings'

export type SignInStatus = 'loggedIn' | 'loggingIn' | 'loggedOut' | 'unknown'

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  messages: any
  currentScreen: ScreenTitle
  addTransaction: AddTransaction
  tags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
}

const state: State = {
  cnt: 0,
  signInStatus: 'unknown',
  messages: {},
  currentScreen: 'add',
  addTransaction: createDefaultAddTransactionState(),
  tags: {},
  transactions: {},
}

export const getInitialState = () => state
