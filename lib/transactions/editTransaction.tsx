import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import CancelIcon from '@material-ui/icons/Cancel'
import { DateTimePicker } from '@material-ui/pickers'
import { pick } from '@siegrift/tsfunct'
import { difference } from 'lodash'
import Router, { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'

import { ObjectOf } from '../../lib/types'
import { RepeatingOption, RepeatingOptions, Tag } from '../addTransaction/state'
import AppBar from '../components/appBar'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import WithSignedUser from '../components/withSignedUser'
import { getCurrentUserId } from '../firebase/util'
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
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  amount: {
    display: 'flex',
    alignSelf: 'stretch',
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

  return (
    <WithSignedUser>
      <AppBar
        returnUrl="/transaction"
        onSave={() => {
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
        }}
        onRemove={() => {
          // TODO: confirm dialog (use different text when removing repeating tx)
          dispatch(removeTx(editedTxId))
          Router.push('/transactions')
        }}
        appBarTitle="Edit transaction"
      />

      <div className={classes.root}>
        <Paper>
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
              onCreateTag={(label) => {
                const id = uuid()
                setNewTags({
                  ...newTags,
                  [id]: {
                    id,
                    name: label,
                    uid: getCurrentUserId(),
                    automatic: false,
                  },
                })
                setTagIds([...tagIds, id])
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
              <FormControl
                aria-label="amount"
                error={shouldValidate && !isAmountInValidFormat(amount)}
              >
                <InputLabel htmlFor="amount-id">Transaction amount</InputLabel>
                <Input
                  inputProps={{ inputMode: 'numeric' }}
                  id="amount-id"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setShouldValidate(true)
                    setAmount(e.target.value)
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <CancelIcon
                        color="primary"
                        onClick={() => setAmount('')}
                        style={{ visibility: amount ? 'visible' : 'hidden' }}
                      />
                    </InputAdornment>
                  }
                />
              </FormControl>

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
              style={{ flex: 1 }}
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
            />
          </Grid>
        </Paper>
      </div>
    </WithSignedUser>
  )
}

export default EditTransaction
