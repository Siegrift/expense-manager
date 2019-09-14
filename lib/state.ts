import { DEFAULT_CURRENCY } from './currencies'
import { ObjectOf } from './types'

export type ScreenTitle = 'add' | 'transactions' | 'settings'

export type TransactionType = 'expense' | 'income'

export interface Tag {
  id: string
  name: string
}

export interface AddTransaction {
  transactionType: TransactionType
  amount: string
  tags: ObjectOf<Tag>
  currency: string
  tagInputValue: string
}

export interface State {
  cnt: number
  // use firebase.auth().currentUser to get the current user
  isSigned: boolean
  messages: any
  currentScreen: ScreenTitle
  addTransaction: AddTransaction
  availableTags: ObjectOf<Tag>
}

const state: State = {
  cnt: 0,
  isSigned: false,
  messages: {},
  currentScreen: 'add',
  addTransaction: {
    transactionType: 'expense',
    amount: '',
    tags: {},
    currency: DEFAULT_CURRENCY.value,
    tagInputValue: '',
  },
  availableTags: {},
}

export const getInitialState = () => state
