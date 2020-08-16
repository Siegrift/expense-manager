import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Theme, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { DateTimePicker } from '@material-ui/pickers'
import { pick } from '@siegrift/tsfunct'
import difference from 'lodash/difference'
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { ObjectOf } from '../../lib/types'
import {
  RepeatingOption,
  RepeatingOptions,
  Tag,
  Transaction,
} from '../addTransaction/state'
import AmountField from '../components/amountField'
import AppBar from '../components/appBar'
import CurrencySelect from '../components/currencySelect'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import TransactionForm from '../components/transactionForm'
import { tagsSel } from '../settings/selectors'
import { CURRENCIES } from '../shared/currencies'
import { isAmountInValidFormat } from '../shared/utils'

import { removeTx, saveTxEdit } from './actions'
import { transactionByIdSel } from './selectors'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  chipField: { flex: 1 },
  amountInput: { marginLeft: theme.spacing(1) },
  row: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  paper: {
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  amount: {
    display: 'flex',
    alignSelf: 'stretch',
    // for desktop
    flex: 1,
  },
  currency: { width: 105, marginLeft: theme.spacing(2) },
}))

interface EditTransactionContentProps {
  tx: Transaction
}

const EditTransactionContent = ({ tx }: EditTransactionContentProps) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const availableTags = useSelector(tagsSel)
  const [amount, setAmount] = useState('' + tx.amount)
  const [isExpense, setIsExpense] = useState(tx.isExpense)
  const [note, setNote] = useState(tx.note)
  const [currency, setCurrency] = useState(tx.currency)
  const [dateTime, setDateTime] = useState(tx.dateTime)
  const [repeating, setRepeating] = useState(tx.repeating)
  const [tagIds, setTagIds] = useState(tx.tagIds)
  const [newTags, setNewTags] = useState<ObjectOf<Tag>>({})
  const [tagInputValue, setTagInputValue] = useState('')
  const [shouldValidate, setShouldValidate] = useState(false)

  const onSaveHandler = () => {
    if (isAmountInValidFormat(amount)) {
      dispatch(
        saveTxEdit(tx.id, newTags, {
          amount: Number.parseFloat(amount),
          isExpense,
          note,
          currency,
          dateTime,
          tagIds,
          repeating,
        }),
      )
      Router.push('/transactions')
    } else {
      setShouldValidate(true)
    }
  }

  return (
    <>
      <AppBar
        returnUrl="/transactions"
        onSave={onSaveHandler}
        onRemove={() => {
          // TODO: confirm dialog (use different text when removing repeating tx)
          dispatch(removeTx(tx.id))
          Router.push('/transactions')
        }}
        appBarTitle="Edit transaction"
      />

      <div className={classes.root}>
        <TransactionForm
          variant="edit"
          isExpense={{
            value: isExpense,
            handler: setIsExpense,
          }}
          tagProps={{
            tags: { ...availableTags, ...newTags },
            currentTagIds: tagIds,
            onSelectTag: (id) => setTagIds([...tagIds, id]),
            onCreateTag: (tag) => {
              setNewTags({
                ...newTags,
                [tag.id]: tag,
              })
              setTagIds([...tagIds, tag.id])
            },
            onRemoveTags: (removeTagIds) => {
              const ids = difference(tagIds, removeTagIds)
              setTagIds(ids)
              setNewTags(
                pick(
                  newTags,
                  ids.filter((id) => availableTags[id] == null),
                ),
              )
            },
            value: tagInputValue,
            onValueChange: (newValue) => setTagInputValue(newValue),
          }}
          amount={{
            value: amount,
            handler: (newAmount) => {
              setShouldValidate(true)
              setAmount(newAmount)
            },
            isValid: isAmountInValidFormat,
            validate: shouldValidate,
          }}
          currency={{ value: currency, handler: setCurrency }}
          dateTime={{ value: dateTime, handler: (dt) => setDateTime(dt!) }}
          repeating={{ value: repeating, handler: setRepeating }}
          note={{ value: note, handler: setNote }}
          onSubmit={onSaveHandler}
        />
      </div>
    </>
  )
}

const EditTransaction = () => {
  const router = useRouter()
  const reduxTx = useSelector(transactionByIdSel(router.query.id as string))

  if (!reduxTx) return null
  return <EditTransactionContent tx={reduxTx} />
}

export default EditTransaction
