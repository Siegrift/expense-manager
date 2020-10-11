import { Tag, Transaction } from './addTransaction/state'
import { Profile } from './settings/state'
import { ObjectOf } from './types'

export type ScreenTitle =
  | 'add'
  | 'transactions'
  | 'charts'
  | 'tags'
  | 'settings'
  | 'overview'

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
  // NOTE: tags, transactions and profile are in sync with firestore, keep local data out of it
  tags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
  profile: ObjectOf<Profile>
  transactionSearch: TransactionSearch
  cursor: number
  user: firebase.User | null
  error: string | null
  confirmTxDeleteDialogOpen: boolean
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
  user: null,
  error: null,
  confirmTxDeleteDialogOpen: false,
  profile: {},
}

export const getInitialState = () => state
