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
  tagInputValue: string
  isExpense: boolean
  note: string
  dateTime: Date
}

export interface Transaction extends BaseTransaction {
  id: string
}

export interface AddTransaction extends BaseTransaction {
  newTags: ObjectOf<Tag>
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
  dateTime: new Date(),
})
