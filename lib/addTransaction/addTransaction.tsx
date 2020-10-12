import React, { useState } from 'react'

import { fpSet, fpUpdate, get, omit, pipe, set } from '@siegrift/tsfunct'
import difference from 'lodash/difference'
import { useDispatch, useSelector } from 'react-redux'

import PageWrapper from '../components/pageWrapper'
import TransactionForm from '../components/transactionForm'
import {
  useEffectAfterFirebaseLoaded,
  useFirebaseLoaded,
} from '../shared/hooks'
import { defaultCurrencySel } from '../shared/selectors'
import { isAmountInValidFormat } from '../shared/utils'

import { addTransaction } from './actions'
import { automaticTagIdsSel, tagsSel } from './selectors'
import {
  AddTransaction as AddTransactionType,
  Tag,
  createDefaultAddTransactionState,
} from './state'

const allFieldsAreValid = (addTx: AddTransactionType) =>
  isAmountInValidFormat(addTx.amount)

const maybeApplyDefaultAmount = (tags: Tag[], amount: string) => {
  if (amount) return amount
  return tags.find((tag) => tag.defaultAmount)?.defaultAmount ?? amount
}

const AddTransaction = () => {
  const dispatch = useDispatch()

  const dataLoaded = useFirebaseLoaded()
  const automaticTagIds = useSelector(automaticTagIdsSel)
  const defaultCurrency = useSelector(defaultCurrencySel)
  const [addTx, setAddTx] = useState(createDefaultAddTransactionState())

  const {
    amount,
    currency,
    tagIds,
    newTags,
    tagInputValue,
    isExpense,
    note,
    dateTime,
    useCurrentTime,
    repeating,
    shouldValidateAmount,
  } = addTx

  const tags = useSelector(tagsSel)
  const allTags = { ...tags, ...newTags }

  const onAddTransaction = () => {
    if (!dataLoaded) return

    // some fields were not filled correctly. Show incorrect ones and return.
    if (!allFieldsAreValid(addTx)) {
      setAddTx((currAddTx) => set(currAddTx, ['shouldValidateAmount'], true))
      return
    }

    dispatch(addTransaction(addTx))
    setAddTx(
      createDefaultAddTransactionState({
        initialTagIds: automaticTagIds,
        initialCurrency: defaultCurrency!,
      }),
    )
  }

  useEffectAfterFirebaseLoaded(() => {
    setAddTx(
      createDefaultAddTransactionState({
        initialTagIds: automaticTagIds,
        initialCurrency: defaultCurrency!,
      }),
    )
  })

  return (
    <PageWrapper>
      <TransactionForm
        variant="add"
        isExpense={{
          value: isExpense,
          handler: (isExpense) =>
            setAddTx((currAddTx) => set(currAddTx, ['isExpense'], isExpense)),
        }}
        tagProps={{
          tags: allTags,
          currentTagIds: tagIds,
          onSelectTag: (id) => {
            setAddTx((currAddTx) => {
              const newTagIds = [...get(currAddTx, ['tagIds']), id]
              return pipe(
                fpSet<typeof currAddTx>()(['tagIds'], newTagIds),
                fpUpdate<typeof currAddTx>()(['amount'], (am) =>
                  maybeApplyDefaultAmount(
                    newTagIds.map((i) => allTags[i]),
                    am,
                  ),
                ),
              )(currAddTx)
            })
          },
          onCreateTag: (tag) => {
            setAddTx((currAddTx) => ({
              ...currAddTx,
              tagIds: [...currAddTx.tagIds, tag.id],
              newTags: {
                ...currAddTx.newTags,
                [tag.id]: tag,
              },
              tagInputValue: '',
            }))
          },
          onRemoveTags: (removedTagIds) => {
            setAddTx((currAddTx) => ({
              ...currAddTx,
              tagIds: difference(currAddTx.tagIds, removedTagIds),
              newTags: omit(
                currAddTx.newTags,
                removedTagIds.filter((id) => !tags.hasOwnProperty(id)),
              ),
              amount: maybeApplyDefaultAmount(
                removedTagIds.map((id) => allTags[id]),
                currAddTx.amount,
              ),
            }))
          },
          value: tagInputValue,
          onValueChange: (newValue) => {
            setAddTx((currAddTx) => set(currAddTx, ['tagInputValue'], newValue))
          },
        }}
        amount={{
          value: amount,
          handler: (newAmount) =>
            setAddTx((currAddTx) => ({
              ...currAddTx,
              amount: newAmount,
              shouldValidateAmount: true,
            })),
          isValid: isAmountInValidFormat,
          validate: shouldValidateAmount,
        }}
        currency={{
          value: currency,
          handler: (value) =>
            setAddTx((currAddTx) => set(currAddTx, ['currency'], value)),
        }}
        note={{
          value: note,
          handler: (value) =>
            setAddTx((currAddTx) => set(currAddTx, ['note'], value)),
        }}
        dateTime={{
          value: dateTime,
          handler: () =>
            setAddTx((currAddTx) => ({
              ...currAddTx,
              dateTime: !useCurrentTime ? new Date() : undefined,
            })),
        }}
        useCurrentTime={{
          value: useCurrentTime,
          handler: () =>
            setAddTx((currAddTx) => ({
              ...currAddTx,
              useCurrentTime: !useCurrentTime,
            })),
        }}
        repeating={{
          value: repeating,
          handler: (value) =>
            setAddTx((currAddTx) => set(currAddTx, ['repeating'], value)),
        }}
        onSubmit={onAddTransaction}
      />
    </PageWrapper>
  )
}

export default AddTransaction
