import {
  createDefaultAddTransactionState,
  AddTransaction,
  Tag,
  Transaction
} from './addTransaction/state'
import { ObjectOf } from './types'

export type ScreenTitle = 'add' | 'transactions' | 'settings'

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  isSigned: boolean
  messages: any
  currentScreen: ScreenTitle
  addTransaction: AddTransaction
  availableTags: ObjectOf<Tag>
  transactions: ObjectOf<Transaction>
}

const state: State = {
  cnt: 0,
  isSigned: false,
  messages: {},
  currentScreen: 'add',
  addTransaction: createDefaultAddTransactionState(),
  availableTags: {},
  transactions: {},
}

export const getInitialState = () => state
