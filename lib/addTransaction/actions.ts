import { omit, pick, set, update } from '@siegrift/tsfunct'
import { firestore } from 'firebase/app'
import uuid from 'uuid/v4'

import { Action, Thunk } from '../redux/types'
import { State } from '../state'
import { ObjectOf } from '../types'

import { createDefaultAddTransactionState, Tag, Transaction } from './state'

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
    const available = state.tags
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

export const resetAddTransaction = (): Action => ({
  type: 'Add transaction',
  reducer: (state) => {
    return {
      ...state,
      addTransaction: createDefaultAddTransactionState(),
    }
  },
})

export const addTransaction = (): Thunk => (dispatch, getState, { logger }) => {
  logger.log('Add transaction')

  // create transaction from addTransaction state
  const addTx = getState().addTransaction
  const id = uuid()
  const tx = {
    id,
    ...omit(addTx, ['newTags', 'tagInputValue', 'useCurrentTime']),
    dateTime: addTx.useCurrentTime ? new Date() : addTx.dateTime!,
  }

  const uploads = [
    dispatch(uploadTransaction(tx)),
    dispatch(uploadTags(getState().addTransaction.newTags)),
  ]

  dispatch(resetAddTransaction())
  return Promise.all(uploads)
}

export const uploadTransaction = (tx: Transaction): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload transaction to firestone')

  return firestore()
    .collection('transactions')
    .doc(tx.id)
    .set(tx)
    .catch((error) => {
      // TODO: handle errors
      console.error('Error writing new message to Firebase Database', error)
    })
}

export const uploadTags = (tags: ObjectOf<Tag>): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload tags to firestone')

  const coll = firestore().collection('tags')
  const uploads = Object.values(tags).map((tag) =>
    coll
      .doc(tag.id)
      .set(tag)
      .catch((error) => {
        // TODO: handle errors
        console.error('Error writing new message to Firebase Database', error)
      }),
  )

  return Promise.all(uploads)
}

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
