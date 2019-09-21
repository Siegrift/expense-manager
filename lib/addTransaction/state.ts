import { DEFAULT_CURRENCY } from '../currencies'
import { ObjectOf } from '../types'

// TODO: later create 'imported', 'automatic'
export type TransactionType = 'fromUser'

export interface Tag {
  id: string
  name: string
}

export interface BaseTransaction {
  transactionType: TransactionType
  amount: string
  // NOTE: order might be important
  tagIds: string[]
  currency: string
  isExpense: boolean
  note: string
}

export interface Transaction extends BaseTransaction {
  id: string
  dateTime: Date
}

export interface AddTransaction extends BaseTransaction {
  useCurrentTime: boolean
  newTags: ObjectOf<Tag>
  dateTime?: Date
  tagInputValue: string
}

export const createDefaultAddTransactionState = (): AddTransaction => ({
  transactionType: 'fromUser',
  amount: '',
  tagIds: [],
  newTags: {},
  currency: DEFAULT_CURRENCY.value,
  tagInputValue: '',
  isExpense: true,
  note: '',
  dateTime: undefined,
  useCurrentTime: true,
})
