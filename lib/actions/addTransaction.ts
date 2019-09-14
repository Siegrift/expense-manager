import { set, update } from '@siegrift/tsfunct'
import uuid from 'uuid/v4'

import { Action } from '../redux/types'
import { State, Tag } from '../state'

export const setAmount = (amount: string): Action<string> => ({
  type: 'Set amount in add transaction (if valid)',
  payload: amount,
  reducer: (state) => {
    if (amount === '' || !isNaN((amount as unknown) as number)) {
      return set(state, ['addTransaction', 'amount'], amount) as State
    } else {
      return state
    }
  },
})

export const setCurrency = (currency: string): Action<string> => ({
  type: 'Set currency in add transaction',
  payload: currency,
  reducer: (state) =>
    set(state, ['addTransaction', 'currency'], currency) as State,
})

export const createNewTag = (tagName: string): Action<string> => ({
  type: 'Create new tag',
  payload: tagName,
  reducer: (state) => {
    const id = uuid()
    return update(state, ['addTransaction'], (addTx) => ({
      ...addTx,
      tagInputValue: '',
      tags: {
        ...addTx.tags,
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
  reducer: (state) =>
    set(
      state,
      ['addTransaction', 'tags'],
      tags.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}),
    ) as State,
})
