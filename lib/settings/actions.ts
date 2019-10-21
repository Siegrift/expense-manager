import { keyBy } from 'lodash'
import uuid from 'uuid/v4'

import { uploadTags, uploadTransactions } from '../actions'
import { Tag, Transaction } from '../addTransaction/state'
import { Action, Thunk } from '../redux/types'
import { DEFAULT_CURRENCY } from '../shared/currencies'
import { downloadFile, isValidDate } from '../shared/utils'
import { State } from '../state'
import { ObjectOf } from '../types'

import { exportedCsvSel } from './selectors'

export const importFromCSV = (
  e: React.ChangeEvent<HTMLInputElement>,
): Thunk => (dispatch, getState, { logger }) => {
  logger.log('Import from csv')
  const chosenFile = e.target.files!.item(0)!
  const reader = new FileReader()

  return new Promise((res) => {
    reader.onload = async () => {
      const { errorReason, tags, txs } = processImportedCSV(
        getState(),
        reader.result as string,
      )

      if (errorReason) {
        // TODO: add to state and display notification
        console.log(errorReason)
      } else {
        // TODO: display success notification
        await dispatch(uploadTags(keyBy([...tags.values()], 'id')))
        await dispatch(uploadTransactions(txs))
      }

      res()
    }

    reader.readAsText(chosenFile)
  })
}

/**
 * Imported csv file must have the following column structure:
 *  1. date - in ISO 8601 format
 *  2. amount - 2 decimal places, negative values means expenses, positive are incomes
 *  3. tags - separated by '|' (pipe)
 *  4. note - optional
 *  other columns are ignored
 */
export const processImportedCSV = (state: State, importedCsv: string) => {
  const lines = importedCsv.trim().split('\n')
  const txs: Transaction[] = []
  const tags = new Map<string, Tag>()
  const stateTagsByName = Object.values(state.tags).reduce(
    (acc, tag) => ({ ...acc, [tag.name]: tag }),
    {} as ObjectOf<Tag>,
  )
  let errorReason: string | undefined

  try {
    for (const line of lines) {
      const t = line.split(',')

      // check for validity
      const dt = new Date(t[0])
      const rawTags = t[2].trim()
      if (!isValidDate(dt)) {
        errorReason = `${t[0]} is not a valid date`
      } else if (t[1].match(/^-?\d+(\.\d{1,2})?$/) === null) {
        errorReason = `${t[1]} is not in a valid amount format`
      } else if (rawTags.length === 0) {
        errorReason = `There must be at least one tag in a transaction`
      }

      // there mustn't be any error when importing
      if (errorReason) {
        break
      }

      const amount = Number.parseFloat(t[1])
      const splitTags = rawTags.split('|')
      splitTags.forEach((tag) => {
        if (!stateTagsByName[tag] && !tags.has(tag)) {
          tags.set(tag, { id: uuid(), name: tag })
        }
      })
      txs.push({
        id: uuid(),
        amount: Math.abs(amount),
        transactionType: 'imported',
        // TODO: support currency
        currency: DEFAULT_CURRENCY.value,
        dateTime: dt,
        isExpense: amount < 0,
        note: t[3],
        tagIds: splitTags.map((tag) => {
          if (tags.get(tag)) {
            return tags.get(tag)!.id
          } else {
            return stateTagsByName[tag].id
          }
        }),
      })
    }
  } catch (e) {
    errorReason =
      'Unknown error. Check whether the data are in correct format.'
  }

  return { errorReason, txs, tags }
}

export const exportToCSV = (): Action => ({
  type: 'Export to csv',
  reducer: (state) => {
    downloadFile('expense-manager-data.csv', exportedCsvSel(state))
    return state
  },
})
