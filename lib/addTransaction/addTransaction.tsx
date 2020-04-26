import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Collapse from '@material-ui/core/Collapse'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { DateTimePicker } from '@material-ui/pickers'
import { fpSet, fpUpdate, get, pick, pipe, set } from '@siegrift/tsfunct'
import difference from 'lodash/difference'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'

import AmountField from '../components/amountField'
import Navigation from '../components/navigation'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import { getCurrentUserId } from '../firebase/util'
import { CURRENCIES } from '../shared/currencies'
import { isAmountInValidFormat } from '../shared/utils'
import { addTransaction } from './actions'
import { automaticTagIdsSel, tagsSel } from './selectors'
import {
  AddTransaction as AddTransactionType,
  RepeatingOption,
  RepeatingOptions,
  Tag,
  createDefaultAddTransactionState,
} from './state'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
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
  },
  currency: { width: 105, marginLeft: theme.spacing(2) },
}))

const allFieldsAreValid = (addTx: AddTransactionType) =>
  isAmountInValidFormat(addTx.amount)

const maybeApplyDefaultAmount = (tags: Tag[], amount: string) => {
  if (amount) return amount
  return tags.find((tag) => tag.defaultAmount)?.defaultAmount ?? amount
}

const AddTransaction = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const automaticTagIds = useSelector(automaticTagIdsSel)
  const [addTx, setAddTx] = useState(
    createDefaultAddTransactionState(automaticTagIds),
  )
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
    // some fields were not filled correctly. Show incorrect and return.
    if (!allFieldsAreValid(addTx)) {
      setAddTx((currAddTx) => set(currAddTx, ['shouldValidateAmount'], true))
      return
    }

    dispatch(addTransaction(addTx))
    setAddTx(createDefaultAddTransactionState(automaticTagIds))
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Paper className={classes.paper}>
        <Grid container className={classes.row}>
          <ButtonGroup variant="contained" fullWidth>
            <Button
              onClick={() =>
                setAddTx((currAddTx) => set(currAddTx, ['isExpense'], true))
              }
              variant="contained"
              color={isExpense ? 'primary' : 'default'}
            >
              Expense
            </Button>
            <Button
              onClick={() =>
                setAddTx((currAddTx) => set(currAddTx, ['isExpense'], false))
              }
              variant="contained"
              color={!isExpense ? 'primary' : 'default'}
            >
              Income
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid className={classes.row}>
          <TagField
            tags={allTags}
            onSelectTag={(id: any) => {
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
            }}
            onCreateTag={(tagName: any) => {
              const id = uuid()
              setAddTx((currAddTx) => ({
                ...currAddTx,
                tagIds: [...currAddTx.tagIds, id],
                newTags: {
                  ...currAddTx.newTags,
                  [id]: {
                    id,
                    name: tagName,
                    uid: getCurrentUserId(),
                    automatic: false,
                  },
                },
                note: '',
                tagInputValue: '',
              }))
            }}
            onSetTagInputValue={(newValue: any) => {
              setAddTx((currAddTx) =>
                set(currAddTx, ['tagInputValue'], newValue),
              )
            }}
            onRemoveTags={(removedTagIds) => {
              setAddTx((currAddTx) => ({
                ...currAddTx,
                tagIds: difference(currAddTx.tagIds, removedTagIds),
                newTags: pick(
                  currAddTx.newTags,
                  removedTagIds.filter((t) => !tags.hasOwnProperty(t)),
                ),
                amount: maybeApplyDefaultAmount(
                  removedTagIds.map((id) => allTags[id]),
                  currAddTx.amount,
                ),
              }))
            }}
            inputValue={tagInputValue}
            currentTagIds={tagIds}
          />
        </Grid>

        <Grid container className={classes.row}>
          <AmountField
            currencySymbol={CURRENCIES[currency]}
            isValidAmount={isAmountInValidFormat}
            shouldValidateAmount={shouldValidateAmount}
            label="Transaction amount"
            value={amount}
            onChange={(newAmount) => {
              setAddTx((currAddTx) => ({
                ...currAddTx,
                amount: newAmount,
                shouldValidateAmount: true,
              }))
            }}
            onPressEnter={() => {
              onAddTransaction()
            }}
          />

          <TextField
            select
            label="Currency"
            value={currency}
            className={classes.currency}
            onChange={(e) => {
              // NOTE: we need to save the value, because it might not exist when the callback is called
              const value = (e.target.value as any) as keyof typeof CURRENCIES
              setAddTx((currAddTx) => set(currAddTx, ['currency'], value))
            }}
          >
            {Object.keys(CURRENCIES).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid className={classes.row} style={{ justifyContent: 'start' }}>
          <FormControlLabel
            control={
              <Switch
                checked={useCurrentTime}
                onChange={() =>
                  setAddTx((currAddTx) => ({
                    ...currAddTx,
                    useCurrentTime: !useCurrentTime,
                    dateTime: !useCurrentTime ? new Date() : undefined,
                  }))
                }
                color="primary"
              />
            }
            label="Use current date and time"
          />
        </Grid>

        <Collapse in={!useCurrentTime}>
          <Grid className={classes.row}>
            <DateTimePicker
              autoOk
              ampm={false}
              disableFuture
              value={dateTime}
              onChange={(newDateTime) =>
                setAddTx((currAddTx) =>
                  set(currAddTx, ['dateTime'], newDateTime as Date),
                )
              }
              label="Transaction date"
              style={{ flex: 1 }}
            />
          </Grid>
        </Collapse>

        <Grid className={classes.row}>
          <FormControl style={{ flex: 1 }}>
            <InputLabel htmlFor="tx-repeating">Repeating</InputLabel>
            <Select
              value={repeating}
              onChange={(e) => {
                // NOTE: we need to save the value, because it might not exist when the callback is called
                const value = e.target.value
                setAddTx((currAddTx) =>
                  set(currAddTx, ['repeating'], value as RepeatingOption),
                )
              }}
              inputProps={{
                name: 'repeating',
                id: 'tx-repeating',
              }}
            >
              {Object.keys(RepeatingOptions)
                .filter((op) => op !== RepeatingOptions.inactive)
                .map((op) => (
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
            onChange={(e) => {
              // NOTE: we need to save the value, because it might not exist when the callback is called
              const value = e.target.value
              setAddTx((currAddTx) => set(currAddTx, ['note'], value))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddTransaction()
            }}
          />
        </Grid>

        <Grid className={classes.row}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onAddTransaction}
            aria-label="add transaction"
          >
            Add transaction
          </Button>
        </Grid>
      </Paper>
      <Navigation />
    </Grid>
  )
}

export default AddTransaction
