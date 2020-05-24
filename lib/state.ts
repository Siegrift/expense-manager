import { Tag, Transaction } from './addTransaction/state'
import { ObjectOf } from './types'

export type ScreenTitle =
  | 'add'
  | 'transactions'
  | 'charts'
  | 'tags'
  | 'settings'

export type SignInStatus = 'loggedIn' | 'loggingIn' | 'loggedOut' | 'unknown'

export interface TransactionSearch {
  value: string
  command?: string
  searchQuery?: string
}

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  currentScreen: ScreenTitle
  // NOTE: tags and transactions are in sync with firestore, keep local data out of it
  tags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
  transactionSearch: TransactionSearch
  cursor: number
}

const state: State = {
  cnt: 0,
  signInStatus: 'unknown',
  currentScreen: 'add',
  tags: {},
  transactions: {},
  transactionSearch: {
    value: '',
  },
  cursor: 0,
}

export const getInitialState = () => state
