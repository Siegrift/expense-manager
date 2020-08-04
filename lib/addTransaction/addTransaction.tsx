import React, { useState } from 'react'

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
import Typography from '@material-ui/core/Typography'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { DateTimePicker } from '@material-ui/pickers'
import { fpSet, fpUpdate, get, pick, pipe, set } from '@siegrift/tsfunct'
import difference from 'lodash/difference'
import { useDispatch, useSelector } from 'react-redux'

import AmountField from '../components/amountField'
import CurrencySelect from '../components/currencySelect'
import { Loading } from '../components/loading'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import { CURRENCIES } from '../shared/currencies'
import {
  mainCurrencySel,
  defaultCurrencySel,
  exchangeRatesSel,
} from '../shared/selectors'
import { useRefreshExchangeRates } from '../shared/transaction/useRefreshExchangeRates'
import { isAmountInValidFormat, computeExchangeRate } from '../shared/utils'

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
  const defaultCurrency = useSelector(defaultCurrencySel)
  const [addTx, setAddTx] = useState(
    createDefaultAddTransactionState(automaticTagIds, defaultCurrency),
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
  const mainCurrency = useSelector(mainCurrencySel)
  const allTags = { ...tags, ...newTags }

  const { loading, error } = useRefreshExchangeRates()
  const exchangeRates = useSelector(exchangeRatesSel)
  const settingsLoaded =
    exchangeRates !== undefined && mainCurrency !== undefined

  const onAddTransaction = () => {
    // some fields were not filled correctly. Show incorrect and return.
    if (!allFieldsAreValid(addTx)) {
      setAddTx((currAddTx) => set(currAddTx, ['shouldValidateAmount'], true))
      return
    }

    dispatch(addTransaction(addTx))
    setAddTx(createDefaultAddTransactionState(automaticTagIds, defaultCurrency))
  }

  return (
    <PageWrapper>
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
            onSelectTag={(id) => {
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
            onCreateTag={(tag: Tag) => {
              setAddTx((currAddTx) => ({
                ...currAddTx,
                tagIds: [...currAddTx.tagIds, tag.id],
                newTags: {
                  ...currAddTx.newTags,
                  [tag.id]: tag,
                },
                note: '',
                tagInputValue: '',
              }))
            }}
            onSetTagInputValue={(newValue) => {
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
            isExpense={isExpense}
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

          <CurrencySelect
            value={currency}
            className={classes.currency}
            onChange={(value) =>
              setAddTx((currAddTx) => set(currAddTx, ['currency'], value))
            }
          />
        </Grid>

        <Collapse in={currency !== mainCurrency} style={{ margin: 0 }}>
          <Grid className={classes.row} style={{ flexWrap: 'wrap' }}>
            {settingsLoaded && (
              <Typography variant="caption">
                1 {currency} is{' '}
                <b>
                  {computeExchangeRate(
                    exchangeRates!.rates,
                    currency,
                    mainCurrency!,
                  ).toFixed(4)}
                </b>{' '}
                {mainCurrency}, rates from <b>{exchangeRates!.date}</b>
              </Typography>
            )}
            {loading && (
              <Typography variant="caption">
                <Loading
                  size={15}
                  imageStyle={{ display: 'inline', marginTop: '2px' }}
                />
                <span style={{ marginLeft: 4, verticalAlign: 'super' }}>
                  Loading fresh exchange rates
                </span>
              </Typography>
            )}
            {error && (
              <Typography variant="caption" style={{ color: 'red' }}>
                <ErrorOutlineIcon fontSize="small" />
                <span style={{ marginLeft: 4, verticalAlign: 'super' }}>
                  Couldn't refresh exchange rates
                </span>
              </Typography>
            )}
          </Grid>
        </Collapse>

        <Grid className={classes.row}>
          <TextField
            fullWidth
            label="Note"
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

        {/* override margin set by parent component */}
        <Collapse in={!useCurrentTime} style={{ margin: 0 }}>
          <Grid className={classes.row}>
            <DateTimePicker
              ampm={false}
              disableFuture
              value={dateTime}
              onChange={(newDateTime) =>
                setAddTx((currAddTx) =>
                  set(currAddTx, ['dateTime'], newDateTime as Date),
                )
              }
              label="Transaction date"
              renderInput={(props) => (
                <TextField {...props} style={{ flex: 1 }} />
              )}
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
    </PageWrapper>
  )
}

export default AddTransaction
