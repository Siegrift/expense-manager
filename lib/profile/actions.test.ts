import keyBy from 'lodash/keyBy'

import { State, getInitialState } from '../state'

import {
  csvFromDataSel,
  dataFromImportedCsvSel,
  dataFromImportedJsonSel,
} from './importExportSelectors'

jest.mock('uuid', () => {
  let uuid = 0
  return {
    v4: () => uuid++,
  }
})

describe('settings actions', () => {
  describe('import/export', () => {
    describe('csv format', () => {
      let state: State

      beforeEach(() => {
        state = getInitialState()
      })

      test('checks for errors', () => {
        const checkError = (input: string) =>
          dataFromImportedCsvSel(input)(state).errorReason

        expect(checkError('')).toBe(
          'Unexpected import error. Check whether the data are in correct format.',
        )

        expect(checkError('invalid_date,-1,Travel|Tickets,,EUR,none')).toBe(
          'invalid_date is not a valid date',
        )
        expect(checkError('21.11.1999,-1,Travel|Tickets,,EUR,none')).toBe(
          '21.11.1999 is not a valid date',
        )
        expect(
          checkError('2017.08.19T00:00:00Z,-1,Travel|Tickets,,EUR,none'),
        ).toBe('2017.08.19T00:00:00Z is not a valid date')

        expect(
          checkError('2017-08-19T00:00:00Z,+2,Travel|Tickets,,EUR,none'),
        ).toBe('+2 is not in a valid amount format')
        expect(
          checkError('2017-08-19T00:00:00Z,-1.345,Travel|Tickets,,EUR,none'),
        ).toBe('-1.345 is not in a valid amount format')

        expect(checkError('2017-08-19T00:00:00Z,2,,,EUR,none')).toBe(
          'There must be at least one tag in a transaction',
        )

        expect(checkError('2017-08-19T00:00:00Z,2,Travel,note,$,none')).toBe(
          'Invalid currency of a transaction',
        )

        expect(
          checkError(
            '2017-08-19T00:00:00Z,-1,Travel|Tickets,,EUR,invalid_repeating',
          ),
        ).toBe('Invalid repeating mode invalid_repeating')
      })

      test('creates new tags and txs', () => {
        state.tags = {
          id1: { id: 'id1', name: 'Travel', uid: 'user_id', automatic: false },
        }
        const csv1 =
          '2017-08-19T00:00:00Z,-1,Travel|Tickets,,EUR,none\n2017-08-16T00:00:00Z,-0.7,Shopping,,EUR,annually'
        const csv2 = '2016-02-16T00:00:00Z,-1.56,A|B|C,,EUR,monthly'

        // Travel tag should be reused from state
        expect(dataFromImportedCsvSel(csv1)(state)).toMatchSnapshot()
        expect(dataFromImportedCsvSel(csv2)(state)).toMatchSnapshot()
      })

      test('exporting imported txs yields identity', () => {
        state.tags = {
          id1: { id: 'id1', name: 'Travel', uid: 'user_id', automatic: false },
        }
        const csv =
          '2017-08-19T00:00:00.000Z,-1,Travel|Tickets,,EUR,none\n2017-08-16T00:00:00.000Z,-0.7,Shopping,,EUR,monthly'

        const imp = dataFromImportedCsvSel(csv)(state)
        const newState: State = {
          ...state,
          transactions: keyBy(imp.transactions, 'id'),
          tags: { ...state.tags, ...keyBy(Object.values(imp.tags), 'id') },
        }
        expect(csvFromDataSel(newState)).toMatchSnapshot()
      })
    })

    describe('json', () => {
      let state: State

      beforeEach(() => {
        state = getInitialState()
      })

      test('checks for errors', () => {
        const checkError = (input: string) =>
          dataFromImportedJsonSel(input)(state).errorReason

        expect(checkError('not a valid json')).toBe(
          'Unable to parse the JSON file. Are you sure the file is a JSON file?',
        )

        expect(checkError('{"tags":{},"transactions":{}}')).toBe(
          `Imported data does not contain all required fields. Missing field: 'profile'`,
        )
        expect(checkError('{"tags":{},"transactions":{},"profile":{}}')).toBeUndefined()

        state = {
          ...state,
          tags: {
            id: { name: 'tagName', id: 'id', automatic: true, uid: 'usedId' },
          },
        }
        expect(
          checkError(
            '{"tags":{"id":{"uid":"uid","name":"otherTagName","defaultAmount":"","id":"id","automatic":true}},"transactions":{},"profile":{}}',
          ),
        ).toBe(
          `Imported data would override current data. Specifically, field 'tags' with id 'id'`,
        )
        expect(
          checkError(
            '{"tags":{"otherId":{"uid":"uid","name":"tagName","defaultAmount":"","id":"otherId","automatic":true}},"transactions":{},"profile":{}}',
          ),
        ).toBe(`There is already a tag with name: 'tagName' and id 'otherId'`)

        expect(
          checkError(
            `{"tags":{"6b94e675-1289-4ce7-8ae2-b98820b517d6":{"name":"Some tag","automatic":false,"id":"6b94e675-1289-4ce7-8ae2-b98820b517d6","uid":"xyaansjD71TyI5airyRi5pMgfN93"}},"transactions":{"a77df95a-d602-48f4-bdde-f82d633b7fe8":{"id":"a77df95a-d602-48f4-bdde-f82d633b7fe8","tagIds":["6b94e675-1289-4ce7-8ae2-b98820b517d6"],"currency":"EUR","isExpense":true,"note":"some note","repeating":"none","amount":55,"dateTime":"2020-11-01T19:50:35.860Z","uid":"xyaansjD71TyI5airyRi5pMgfN93","rate":1}},"profile":{"xyaansjD71TyI5airyRi5pMgfN93":{"id":"xyaansjD71TyI5airyRi5pMgfN93","exchangeRates":{"rates":{"CHF":1.0698,"HKD":9.0706,"SEK":10.365,"USD":1.1698,"GBP":0.90208,"HUF":367.45,"CZK":27.251,"AUD":1.6563,"HRK":7.5748,"PLN":4.6222,"EUR":1},"base":"EUR","date":"2020-10-30"},"settings":{"defaultCurrency":"EUR","mainCurrency":"EUR"},"uid":"xyaansjD71TyI5airyRi5pMgfN93"}}}`,
          ),
        ).toBeUndefined()
      })
    })
  })
})
