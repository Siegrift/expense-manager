import { DEFAULT_CURRENCY } from '../shared/currencies'
import { ObjectOf } from '../types'

export enum TransactionTypes {
  fromUser = 'fromUser',
  imported = 'imported',
  repeated = 'repeated',
}

export type TransactionType = keyof typeof TransactionTypes

export interface Tag {
  id: string
  name: string
  uid: string
}

export enum RepeatingOptions {
  none = 'none',
  inactive = 'inactive',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  annually = 'annually',
}

export type RepeatingOption = keyof typeof RepeatingOptions

export interface BaseTransaction {
  transactionType: TransactionType
  // NOTE: order might be important
  tagIds: string[]
  currency: string
  isExpense: boolean
  note: string
  repeating: RepeatingOption
}

export interface Transaction extends BaseTransaction {
  id: string
  dateTime: Date
  amount: number
  uid: string
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
  transactionType: TransactionTypes.fromUser,
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
  repeating: RepeatingOptions.none,
})
