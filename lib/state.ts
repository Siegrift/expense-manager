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

/**
 * This is the state that should be saved in backup.
 */
export interface SerializableState {
  tags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
  profile: ObjectOf<Profile>
}

export interface State extends SerializableState {
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  currentScreen: ScreenTitle
  transactionSearch: TransactionSearch
  cursor: number
  user: firebase.User | null
  error: string | null
  // TODO: refactor this to store multiple types of confirm dialogs
  confirmTxDeleteDialogOpen: boolean
}

const state: State = {
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
