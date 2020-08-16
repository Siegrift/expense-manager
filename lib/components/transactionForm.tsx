import React from 'react'

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
import { useSelector } from 'react-redux'

import { RepeatingOption, RepeatingOptions, Tag } from '../addTransaction/state'
import AmountField from '../components/amountField'
import { Loading } from '../components/loading'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import { Currency, CURRENCIES } from '../shared/currencies'
import { useFirebaseLoaded } from '../shared/hooks'
import { mainCurrencySel, exchangeRatesSel } from '../shared/selectors'
import { useRefreshExchangeRates } from '../shared/transaction/useRefreshExchangeRates'
import { computeExchangeRate } from '../shared/utils'
import { ObjectOf } from '../types'

import CurrencySelect from './currencySelect'

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

type FieldProps<T> = {
  value: T
  handler: (newValue: T) => void
}
type FieldPropsWithValidation<T> = FieldProps<T> & {
  isValid: (value: T) => boolean
  validate: boolean
}

interface BaseProps {
  isExpense: FieldProps<boolean>
  tagProps: {
    tags: ObjectOf<Tag>
    currentTagIds: string[]
    onSelectTag: (id: string) => void
    onCreateTag: (tag: Tag) => void
    onRemoveTags: (tagIds: string[]) => void
    value: string
    onValueChange: (newValue: string) => void
  }
  amount: FieldPropsWithValidation<string>
  currency: FieldProps<Currency>
  dateTime: FieldProps<Date | undefined | null>
  repeating: FieldProps<RepeatingOption>
  note: FieldProps<string>
  onSubmit: () => void
}

type AddTxFormVariantProps = {
  variant: 'add'
  useCurrentTime: FieldProps<boolean>
}
type EditTxFormVariantProps = { variant: 'edit' }

type VariantProps = AddTxFormVariantProps | EditTxFormVariantProps

type TransactionFormProps = BaseProps & VariantProps

const TransactionForm = (props: TransactionFormProps) => {
  const {
    variant,
    tagProps,
    isExpense,
    amount,
    currency,
    dateTime,
    onSubmit,
    repeating,
    note,
  } = props
  const useCurrentTime =
    variant === 'add' && (props as AddTxFormVariantProps).useCurrentTime

  const classes = useStyles()

  const mainCurrency = useSelector(mainCurrencySel)
  const exchangeRates = useSelector(exchangeRatesSel)
  const settingsLoaded = useFirebaseLoaded()

  const { loading, error } = useRefreshExchangeRates()

  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.row}>
        <ButtonGroup variant="contained" fullWidth>
          <Button
            onClick={() => isExpense.handler(true)}
            variant="contained"
            color={isExpense.value ? 'primary' : 'default'}
          >
            Expense
          </Button>
          <Button
            onClick={() => isExpense.handler(false)}
            variant="contained"
            color={!isExpense.value ? 'primary' : 'default'}
          >
            Income
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid className={classes.row}>
        <TagField
          tags={tagProps.tags}
          onSelectTag={tagProps.onSelectTag}
          onCreateTag={tagProps.onCreateTag}
          onSetTagInputValue={tagProps.onValueChange}
          onRemoveTags={tagProps.onRemoveTags}
          inputValue={tagProps.value}
          currentTagIds={tagProps.currentTagIds}
        />
      </Grid>

      <Grid container className={classes.row}>
        <AmountField
          isExpense={isExpense.value}
          currency={CURRENCIES[currency.value]}
          isValidAmount={amount.isValid}
          shouldValidateAmount={amount.validate}
          label="Transaction amount"
          value={amount.value}
          onChange={amount.handler}
          onPressEnter={onSubmit}
        />

        <CurrencySelect
          value={currency.value}
          className={classes.currency}
          onChange={currency.handler}
        />
      </Grid>

      <Collapse in={currency.value !== mainCurrency} style={{ margin: 0 }}>
        <Grid className={classes.row} style={{ flexWrap: 'wrap' }}>
          {settingsLoaded && (
            <>
              <Typography variant="caption">
                {(parseFloat(amount.value) || 0).toFixed(
                  CURRENCIES[currency.value].scale,
                )}{' '}
                {currency.value}
                {' = '}
                <b>
                  {(
                    (parseFloat(amount.value) || 0) *
                    computeExchangeRate(
                      exchangeRates!.rates,
                      currency.value,
                      mainCurrency!,
                    )
                  ).toFixed(CURRENCIES[mainCurrency!].scale)}{' '}
                  {mainCurrency}
                </b>
              </Typography>
              <Typography variant="caption" style={{ marginLeft: 8 }}>
                <i>(rates from {exchangeRates!.date})</i>
              </Typography>
            </>
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
          value={note.value}
          onChange={(e) => note.handler(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit()
          }}
        />
      </Grid>

      {useCurrentTime && (
        <>
          <Grid className={classes.row} style={{ justifyContent: 'start' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useCurrentTime.value}
                  onChange={() => useCurrentTime.handler(!useCurrentTime.value)}
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
                value={dateTime.value}
                onChange={dateTime.handler}
                label="Transaction date"
                renderInput={(props) => (
                  <TextField {...props} style={{ flex: 1 }} />
                )}
              />
            </Grid>
          </Collapse>
        </>
      )}

      <Grid className={classes.row}>
        <FormControl style={{ flex: 1 }}>
          <InputLabel htmlFor="tx-repeating">Repeating</InputLabel>
          <Select
            value={repeating.value}
            onChange={(e) => repeating.handler(e.target.value as any)}
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
          onClick={onSubmit}
          aria-label="add transaction"
        >
          Add transaction
        </Button>
      </Grid>
    </Paper>
  )
}

export default TransactionForm
