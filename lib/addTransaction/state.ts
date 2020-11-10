import { Currency, DEFAULT_CURRENCY } from '../shared/currencies'
import { ObjectOf, FirebaseField } from '../types'

export interface Tag extends FirebaseField {
  name: string
  automatic: boolean
  defaultAmount?: string // can be empty
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
  rate?: number
  // NOTE: order might be important
  tagIds: string[]
  currency: Currency
  isExpense: boolean
  note: string
  repeating: RepeatingOption
}

export interface Transaction extends BaseTransaction, FirebaseField {
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

type CreateStateProps = {
  initialTagIds: string[]
  initialCurrency: Currency
}

export const createDefaultAddTransactionState = (
  initialProps?: CreateStateProps,
): AddTransaction => ({
  amount: '',
  tagIds: initialProps?.initialTagIds || [],
  newTags: {},
  currency: initialProps?.initialCurrency || DEFAULT_CURRENCY,
  tagInputValue: '',
  isExpense: true,
  note: '',
  dateTime: undefined,
  useCurrentTime: true,
  shouldValidateAmount: false,
  repeating: RepeatingOptions.none,
})
