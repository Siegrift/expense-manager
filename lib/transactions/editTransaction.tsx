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
import { RepeatingOption, RepeatingOptions, Tag } from '../addTransaction/state'
import AmountField from '../components/amountField'
import AppBar from '../components/appBar'
import Paper from '../components/paper'
import TagField from '../components/tagField'
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

const EditTransaction = () => {
  const router = useRouter()
  const classes = useStyles()
  const availableTags = useSelector(tagsSel)
  // TODO: including all of these is needed because hooks need to be called on each render
  // can be fixed by making useRedirectIfNotSignedIn a HOC
  const reduxTx = useSelector(transactionByIdSel(router.query.id as string))
  // FIXME: next build prerenders these and the router id is not valid and build fails on next line
  if (!reduxTx) {
    return null
  }
  // NOTE: don't forget to add the property to save tx
  const [amount, setAmount] = useState('' + reduxTx.amount)
  const [isExpense, setIsExpense] = useState(reduxTx.isExpense)
  const [note, setNote] = useState(reduxTx.note)
  const [currency, setCurrency] = useState(reduxTx.currency)
  const [dateTime, setDateTime] = useState(reduxTx.dateTime)
  const [repeating, setRepeating] = useState(reduxTx.repeating)
  const [tagIds, setTagIds] = useState(reduxTx.tagIds)
  const [newTags, setNewTags] = useState<ObjectOf<Tag>>({})
  const [tagInputValue, setTagInputValue] = useState('')
  const [shouldValidate, setShouldValidate] = useState(false)
  const dispatch = useDispatch()
  // TODO: validate that txId is a valid txs id
  const editedTxId = router.query.id as string

  const onSaveHandler = () => {
    if (isAmountInValidFormat(amount)) {
      dispatch(
        saveTxEdit(editedTxId, newTags, {
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
          dispatch(removeTx(editedTxId))
          Router.push('/transactions')
        }}
        appBarTitle="Edit transaction"
      />

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container className={classes.row}>
            <ButtonGroup variant="contained" fullWidth>
              <Button
                onClick={() => setIsExpense(true)}
                variant="contained"
                color={isExpense ? 'primary' : 'default'}
              >
                Expense
              </Button>
              <Button
                onClick={() => setIsExpense(false)}
                variant="contained"
                color={!isExpense ? 'primary' : 'default'}
              >
                Income
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid className={classes.row}>
            <TagField
              className={classes.chipField}
              tags={{ ...availableTags, ...newTags }}
              onSelectTag={(id) => setTagIds([...tagIds, id])}
              onCreateTag={(tag) => {
                setNewTags({
                  ...newTags,
                  [tag.id]: tag,
                })
                setTagIds([...tagIds, tag.id])
              }}
              onRemoveTags={(removeTagIds) => {
                const ids = difference(tagIds, removeTagIds)
                setTagIds(ids)
                setNewTags(
                  pick(
                    newTags,
                    ids.filter((id) => availableTags[id] == null),
                  ),
                )
              }}
              onSetTagInputValue={(newValue) => setTagInputValue(newValue)}
              inputValue={tagInputValue}
              currentTagIds={tagIds}
            />
          </Grid>

          <Grid container className={classes.row}>
            <Grid item className={classes.amount}>
              <AmountField
                currencySymbol={CURRENCIES[currency]}
                isValidAmount={isAmountInValidFormat}
                shouldValidateAmount={shouldValidate}
                label="Transaction amount"
                value={amount}
                onChange={(newAmount) => {
                  setShouldValidate(true)
                  setAmount(newAmount)
                }}
                onPressEnter={onSaveHandler}
              />

              <TextField
                select
                label="Currency"
                value={currency}
                className={classes.currency}
                onChange={(e) =>
                  setCurrency(
                    (e.target.value as any) as keyof typeof CURRENCIES,
                  )
                }
              >
                {Object.keys(CURRENCIES).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid className={classes.row}>
            <DateTimePicker
              autoOk
              ampm={false}
              disableFuture
              value={dateTime}
              onChange={(newDateTime) => setDateTime(newDateTime as Date)}
              label="Transaction date"
              renderInput={(props) => (
                <TextField {...props} style={{ flex: 1 }} />
              )}
            />
          </Grid>

          <Grid className={classes.row}>
            <FormControl style={{ flex: 1 }}>
              <InputLabel htmlFor="tx-repeating">Repeating</InputLabel>
              <Select
                value={repeating}
                onChange={(e) =>
                  setRepeating(e.target.value as RepeatingOption)
                }
                inputProps={{
                  name: 'repeating',
                  id: 'tx-repeating',
                }}
              >
                {Object.keys(RepeatingOptions).map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid className={classes.row}>
            <TextField
              fullWidth
              label="Additional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveHandler()
              }}
            />
          </Grid>
        </Paper>
      </div>
    </>
  )
}

export default EditTransaction
