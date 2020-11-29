import { Color as NotificationSeverity } from '@material-ui/lab/Alert'

import { Tag, Transaction } from './addTransaction/state'
import { Profile } from './profile/state'
import { ObjectOf } from './types'

export type ScreenTitle =
  | 'add'
  | 'transactions'
  | 'charts'
  | 'tags'
  | 'profile'
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

export interface NotificationState {
  severity: NotificationSeverity
  message: string
}

// TODO: add custom date range
export type OverviewPeriod = 'week' | 'wtd' | 'month' | 'mtd'

export interface State extends SerializableState {
  // use firebase.auth().currentUser to get the current user
  signInStatus: SignInStatus
  currentScreen: ScreenTitle
  transactionSearch: TransactionSearch
  cursor: number
  user: firebase.User | null
  notification: NotificationState | null
  // TODO: this doesn't work when trying to delete transaction other then cursor one
  confirmTxDeleteDialogOpen: boolean
  overviewPeriod: OverviewPeriod
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
  notification: null,
  confirmTxDeleteDialogOpen: false,
  profile: {},
  overviewPeriod: 'week',
}

export const getInitialState = () => state
