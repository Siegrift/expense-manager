import { keyBy } from 'lodash'

import { getInitialState, State } from '../state'

import { processImportedCSV } from './actions'
import { exportedCsvSel } from './selectors'

jest.mock('uuid/v4', () => {
  let uuid = 0
  return jest.fn(() => `uuid${uuid++}`)
})

describe('settings actions', () => {
  describe('import/export', () => {
    describe('processing imported txs', () => {
      let state: State

      beforeEach(() => {
        state = getInitialState()
      })

      test('checks for errors', () => {
        const checkError = (input: string) =>
          processImportedCSV(state, input).errorReason

        expect(checkError('')).toBe(
          'Unknown error. Check whether the data are in correct format.',
        )

        expect(checkError('invalid_date,-1,Travel|Tickets,,EUR')).toBe(
          'invalid_date is not a valid date',
        )
        expect(checkError('21.11.1999,-1,Travel|Tickets,,EUR')).toBe(
          '21.11.1999 is not a valid date',
        )
        expect(checkError('2017.08.19T00:00:00Z,-1,Travel|Tickets,,EUR')).toBe(
          '2017.08.19T00:00:00Z is not a valid date',
        )

        expect(checkError('2017-08-19T00:00:00Z,+2,Travel|Tickets,,EUR')).toBe(
          '+2 is not in a valid amount format',
        )
        expect(
          checkError('2017-08-19T00:00:00Z,-1.345,Travel|Tickets,,EUR'),
        ).toBe('-1.345 is not in a valid amount format')

        expect(checkError('2017-08-19T00:00:00Z,2,,,EUR')).toBe(
          'There must be at least one tag in a transaction',
        )

        expect(checkError('2017-08-19T00:00:00Z,2,Travel,note,$')).toBe(
          'Invalid currency of a transaction',
        )
      })

      test('creates new tags and txs', () => {
        state.tags = { id1: { id: 'id1', name: 'Travel' } }
        const csv1 =
          '2017-08-19T00:00:00Z,-1,Travel|Tickets,,EUR\n2017-08-16T00:00:00Z,-0.7,Shopping,,EUR'
        const csv2 = '2016-02-16T00:00:00Z,-1.56,A|B|C,,EUR'

        // Travel tag should be reused from state
        expect(processImportedCSV(state, csv1)).toMatchSnapshot()
        expect(processImportedCSV(state, csv2)).toMatchSnapshot()
      })

      test('exporting imported txs yields identity', () => {
        state.tags = { id1: { id: 'id1', name: 'Travel' } }
        const csv =
          '2017-08-19T00:00:00.000Z,-1,Travel|Tickets,,EUR\n2017-08-16T00:00:00.000Z,-0.7,Shopping,,EUR'

        const imp = processImportedCSV(state, csv)
        const newState: State = {
          ...state,
          transactions: keyBy(imp.txs, 'id'),
          tags: { ...state.tags, ...keyBy([...imp.tags.values()], 'id') },
        }
        expect(exportedCsvSel(newState)).toBe(csv)
      })
    })
  })
})