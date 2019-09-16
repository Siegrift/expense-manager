import { omit, pick, set, update } from '@siegrift/tsfunct'
import uuid from 'uuid/v4'

import { Action } from '../redux/types'
import { State } from '../state'
import { ObjectOf } from '../types'

import { createDefaultAddTransactionState, Tag } from './state'

export const setAmount = (amount: string): Action<string> => ({
  type: 'Set amount in add transaction',
  payload: amount,
  reducer: (state) => set(state, ['addTransaction', 'amount'], amount) as State,
})

export const setCurrency = (currency: string): Action<string> => ({
  type: 'Set currency in add transaction',
  payload: currency,
  reducer: (state) =>
    set(state, ['addTransaction', 'currency'], currency) as State,
})

export const createNewTag = (tagName: string): Action<string> => ({
  type: 'Create new tag in add transaction (if not empty)',
  payload: tagName,
  reducer: (state) => {
    if (tagName === '') {
      return state
    }

    const id = uuid()
    return update(state, ['addTransaction'], (addTx) => ({
      ...addTx,
      tagInputValue: '',
      tagIds: [...addTx.tagIds, id],
      newTags: {
        ...addTx.newTags,
        [id]: {
          id,
          name: tagName,
        },
      },
    }))
  },
})

export const setTagInputValue = (value: string): Action<string> => ({
  type: 'Set tag input value',
  payload: value,
  reducer: (state) =>
    set(state, ['addTransaction', 'tagInputValue'], value) as State,
})

export const setTags = (tags: Tag[]): Action<Tag[]> => ({
  type: 'Set tags in input field',
  payload: tags,
  reducer: (state) => {
    const available = state.availableTags
    const tagIds = tags.map((t) => t.id)
    return {
      ...state,
      addTransaction: {
        ...state.addTransaction,
        tagIds,
        newTags: pick(
          state.addTransaction.newTags,
          tagIds.filter((t) => !available.hasOwnProperty(t)),
        ) as ObjectOf<Tag>,
      },
    }
  },
})

export const setIsExpense = (isExpense: boolean): Action<boolean> => ({
  type: 'Set is expense',
  payload: isExpense,
  reducer: (state) =>
    set(state, ['addTransaction', 'isExpense'], isExpense) as State,
})

export const setNote = (note: string): Action<string> => ({
  type: 'Set note in add transaction',
  payload: note,
  reducer: (state) => set(state, ['addTransaction', 'note'], note) as State,
})

export const setDateTime = (dateTime: Date): Action<Date> => ({
  type: 'Set date time in add transaction',
  payload: dateTime,
  reducer: (state) =>
    set(state, ['addTransaction', 'dateTime'], dateTime) as State,
})

export const addTransaction = (): Action => ({
  type: 'Add transaction',
  reducer: (state) => {
    const id = uuid()
    const tx = state.addTransaction
    return {
      ...state,
      addTransaction: createDefaultAddTransactionState(),
      transactions: {
        ...state.transactions,
        [id]: {
          id,
          ...omit(tx, ['newTags']),
          dateTime: tx.useCurrentTime ? new Date() : tx.dateTime!,
        },
      },
      availableTags: { ...state.availableTags, ...tx.newTags },
    }
  },
})

export const setUseCurrentTime = (
  useCurrentTime: boolean,
): Action<boolean> => ({
  type: 'Set current time',
  payload: useCurrentTime,
  reducer: (state) =>
    set(state, ['addTransaction'], {
      ...state.addTransaction,
      useCurrentTime,
      dateTime: useCurrentTime ? new Date() : undefined,
    }) as State,
})
