import { DEFAULT_CURRENCY } from '../shared/currencies'
import { ObjectOf } from '../types'

export type TransactionType = 'fromUser' | 'imported'

export interface Tag {
  id: string
  name: string
}

export interface BaseTransaction {
  transactionType: TransactionType
  // NOTE: order might be important
  tagIds: string[]
  currency: string
  isExpense: boolean
  note: string
}

export interface Transaction extends BaseTransaction {
  id: string
  dateTime: Date
  amount: number
}

export interface AddTransaction extends BaseTransaction {
  useCurrentTime: boolean
  newTags: ObjectOf<Tag>
  dateTime?: Date
  tagInputValue: string
  amount: string
  shouldValidateAmount: boolean
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
  shouldValidateAmount: false,
})
