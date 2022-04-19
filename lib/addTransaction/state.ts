import { FileObject } from 'material-ui-dropzone'

import { Currency, DEFAULT_CURRENCY } from '../shared/currencies'
import { ObjectOf, FirebaseField } from '../types'

export interface Tag extends FirebaseField {
  name: string
  automatic: boolean
  defaultAmount?: string // can be empty
  isAsset?: boolean // older tags do not have this property defined
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

interface BaseTransaction {
  rate?: number
  // NOTE: order might be important
  tagIds: string[]
  currency: Currency
  isExpense?: boolean
  note: string
  repeating: RepeatingOption
}

// TODO: rename to BasicTansaction
export interface Transaction extends BaseTransaction, FirebaseField {
  type: 'expense' | 'income'
  dateTime: Date
  amount: number
  attachedFiles?: string[]
}

export interface TransferTransaction extends Omit<Transaction, 'type'> {
  type: 'transfer'
  // TODO: Maybe arrays
  fromTagId: string
  toTagId: string
}

// TODO: Rename to Transaction
export type AnyTransaction = Transaction | TransferTransaction

export interface AddTransaction extends BaseTransaction {
  type: 'expense' | 'income' | 'transfer'
  tagIds: string[]
  useCurrentTime: boolean
  newTags: ObjectOf<Tag>
  dateTime?: Date
  tagInputValue: string
  amount: string
  shouldValidateAmount: boolean
  attachedFileObjects: FileObject[]
  fromTagId?: string
  toTagId?: string
}

type CreateStateProps = {
  initialTagIds: string[]
  initialCurrency: Currency
}

export const createDefaultAddTransactionState = (initialProps?: CreateStateProps): AddTransaction => ({
  amount: '',
  tagIds: initialProps?.initialTagIds || [],
  newTags: {},
  currency: initialProps?.initialCurrency || DEFAULT_CURRENCY,
  tagInputValue: '',
  type: 'expense',
  note: '',
  dateTime: undefined,
  useCurrentTime: true,
  shouldValidateAmount: false,
  repeating: RepeatingOptions.none,
  attachedFileObjects: [],
})
