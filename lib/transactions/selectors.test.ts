import { Transaction } from '../addTransaction/state'
import { getInitialState, State } from '../state'

import { sortedTransactionsSel } from './selectors'

describe('txs selectors', () => {
  test('sortedTransactionsSel sorts txs by latest', () => {
    const [tx1, tx2, tx3] = [
      { id: 'tx1', dateTime: new Date('2018-11-16') } as Transaction,
      { id: 'tx2', dateTime: new Date('2018-11-15') } as Transaction,
      { id: 'tx3', dateTime: new Date('2018-11-18') } as Transaction,
    ]
    const state: State = {
      ...getInitialState(),
      transactions: {
        tx1,
        tx2,
        tx3,
      },
    }

    expect(sortedTransactionsSel(state)).toEqual([tx3, tx1, tx2])
  })
})
