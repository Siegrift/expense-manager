import mockdate from 'mockdate'

import { getInitialState, State } from '../state'
import { initializeMockFirebase } from '../testing'
import { ObjectOf } from '../types'

import {
  createNewTag,
  resetAddTransaction,
  setAmount,
  setCurrency,
  setDateTime,
  setIsExpense,
  setNote,
  setTags,
  setTagInputValue,
  setUseCurrentTime
} from './actions'
import { Tag } from './state'

// https://github.com/facebook/jest/issues/2172
jest.mock('uuid/v4', () => {
  let uuid = 0
  return jest.fn(() => `uuid${uuid++}`)
})

jest.mock('../firebase/firebase', () => initializeMockFirebase())

describe('Add transaction tests', () => {
  let state: State
  const createTestTagsObject = (ids: string[]): ObjectOf<Tag> =>
    ids.reduce((acc, id) => ({ ...acc, [id]: { id, name: 'name' + id } }), {})

  beforeEach(() => {
    state = getInitialState()
  })

  test('setAmount changes the amount', () => {
    expect(state.addTransaction.amount).toBe('')
    const newState = setAmount('12.4').reducer(state)
    expect(newState.addTransaction.amount).toBe('12.4')
  })

  test('setCurrency changes the currency', () => {
    expect(state.addTransaction.currency).toBe('EUR')
    const newState = setCurrency('USD').reducer(state)
    expect(newState.addTransaction.currency).toBe('USD')
  })

  describe('createNewTag', () => {
    test("doesn't create empty tag", () => {
      const newState = createNewTag('').reducer(state)
      expect(newState).toBe(state)
    })

    test('creates new tag', () => {
      const newState = createNewTag('tagName').reducer(state)
      const id = 'uuid0'
      expect(newState.addTransaction.newTags).toEqual({
        [id]: { id, name: 'tagName', uid: 'mockedUserId' },
      })
    })
  })

  test('setTagInputValue', () => {
    const newState = setTagInputValue('tagName').reducer(state)
    expect(newState.addTransaction.tagInputValue).toBe('tagName')
  })

  describe('setTags', () => {
    beforeEach(() => {
      state = {
        ...state,
        addTransaction: {
          ...state.addTransaction,
          newTags: createTestTagsObject(['id1', 'id2']),
          tagIds: ['id1', 'id2', 'id3'],
        },
        tags: createTestTagsObject(['id3']),
      }
    })

    test('correctly updates tags', () => {
      const newState = setTags([{ id: 'id1', name: 'id1' }]).reducer(state)
      expect(newState.tags).toEqual(createTestTagsObject(['id3']))
      expect(newState.addTransaction.newTags).toEqual(
        createTestTagsObject(['id1']),
      )
      expect(newState.addTransaction.tagIds).toEqual(['id1'])
    })
  })

  test('setIsExpense', () => {
    expect(state.addTransaction.isExpense).toBe(true)
    const newState = setIsExpense(false).reducer(state)
    expect(newState.addTransaction.isExpense).toBe(false)
  })

  test('setNote', () => {
    const newState = setNote('note').reducer(state)
    expect(newState.addTransaction.note).toBe('note')
  })

  test('setDateTime', () => {
    const now = new Date()
    const newState = setDateTime(now).reducer(state)
    expect(newState.addTransaction.dateTime).toBe(now)
  })

  describe('addTransactionLocally', () => {
    let mockedDate

    beforeEach(() => {
      state = {
        ...state,
        addTransaction: {
          amount: '12.4',
          currency: 'EUR',
          dateTime: undefined,
          isExpense: true,
          newTags: createTestTagsObject(['id2']),
          note: 'note',
          tagIds: ['id1', 'id2'],
          tagInputValue: 'unfinished',
          transactionType: 'fromUser',
          useCurrentTime: true,
          shouldValidateAmount: false,
        },
        tags: createTestTagsObject(['id1']),
      }

      mockedDate = new Date()
      mockdate.set(mockedDate)
    })

    afterEach(() => {
      mockdate.reset()
    })

    test('adds a transaction to transactions', () => {
      const id = 'uuid1'
      const newState = resetAddTransaction().reducer(state)

      expect(newState.transactions[id]).not.toBeDefined()
      expect(newState.addTransaction).toEqual(getInitialState().addTransaction)
      expect(newState.tags).toEqual(createTestTagsObject(['id1']))
    })
  })

  test('setUseCurrentTime', () => {
    expect(state.addTransaction.useCurrentTime).toBe(true)
    const newState = setUseCurrentTime(false).reducer(state)
    expect(newState.addTransaction.useCurrentTime).toBe(false)
  })
})
