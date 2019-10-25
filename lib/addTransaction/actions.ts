import { omit, pick, set, update } from '@siegrift/tsfunct'
import uuid from 'uuid/v4'

import { uploadToFirebase } from '../actions'
import { getCurrentUserId } from '../firebase/util'
import { Action, Thunk } from '../redux/types'
import { State } from '../state'
import { ObjectOf } from '../types'

import { isInvalidAmountSel } from './selectors'
import { createDefaultAddTransactionState, Tag } from './state'

export const setAmount = (amount: string): Action<string> => ({
  type: 'Set amount in add transaction',
  payload: amount,
  reducer: (state) => {
    const newState = set(state, ['addTransaction', 'amount'], amount)
    return set(
      newState,
      ['addTransaction', 'shouldValidateAmount'],
      true,
    ) as State
  },
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
      tagIds: [...addTx.tagIds, id],
      newTags: {
        ...addTx.newTags,
        [id]: {
          id,
          name: tagName,
          uid: getCurrentUserId(),
        },
      },
    }))
  },
})

export const clearInputValue = (): Action => ({
  type: 'Clear input value',
  reducer: (state) => set(state, ['addTransaction', 'tagInputValue'], '') as State,
})

export const selectNewTag = (tagId: string): Action<string> => ({
  type: 'Add tag to selection (if not already selected)',
  payload: tagId,
  reducer: (state) =>
    // FIXME: fix tsfunct
    update(state, ['addTransaction', 'tagIds'], (ids: any) =>
      ids.includes(tagId) ? ids : [...ids, tagId],
    ) as State,
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
          // TODO: tsfunct error
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

export const addTransaction = (): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Add transaction')

  // some fields were not filled correctly. Show incorrect and return.
  if (isInvalidAmountSel(getState())) {
    dispatch(triggerValidation())
    return Promise.resolve()
  }

  // create transaction from addTransaction state
  const addTx = getState().addTransaction
  const id = uuid()
  const tx = {
    id,
    ...omit(addTx, ['newTags', 'tagInputValue', 'useCurrentTime']),
    amount: Number.parseFloat(addTx.amount),
    dateTime: addTx.useCurrentTime ? new Date() : addTx.dateTime!,
    uid: getCurrentUserId(),
  }

  await dispatch(
    uploadToFirebase([tx], Object.values(getState().addTransaction.newTags)),
  )
  dispatch(resetAddTransaction())
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

export const triggerValidation = (): Action => ({
  type: 'Trigger validation',
  reducer: (state) =>
    set(state, ['addTransaction', 'shouldValidateAmount'], true) as State,
})
