import {
  createDefaultAddTransactionState,
  AddTransaction,
  Tag,
  Transaction
} from './addTransaction/state'
import { ObjectOf } from './types'

export type ScreenTitle = 'add' | 'transactions' | 'settings'

export type SignInStatus = 'loggedIn' | 'loggingIn' | 'loggedOut'

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  messages: any
  currentScreen: ScreenTitle
  addTransaction: AddTransaction
  availableTags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
}

const state: State = {
  cnt: 0,
  signInStatus: 'loggedOut',
  messages: {},
  currentScreen: 'add',
  addTransaction: createDefaultAddTransactionState(),
  availableTags: {},
  transactions: {},
}

export const getInitialState = () => state
