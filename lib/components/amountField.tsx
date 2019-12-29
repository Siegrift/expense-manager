import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import CancelIcon from '@material-ui/icons/Cancel'
import { omit } from '@siegrift/tsfunct'
import React from 'react'
import NumberFormat from 'react-number-format'

interface AmountFieldProps {
  shouldValidateAmount: boolean
  isValidAmount: (amount: string) => boolean
  value: string
  onChange: (amount: string) => void
  label: string
  className?: string
  currencySymbol?: string
}

const IInput = (formatProps: any & { clearAmount: () => void }) => {
  return (
    <Input
      {...omit(formatProps, ['clearAmount'])}
      id="amount-id"
      placeholder="0.00"
      value={formatProps.value}
      endAdornment={
        <InputAdornment position="end">
          <CancelIcon
            color="primary"
            onClick={formatProps.clearAmount}
            style={{
              visibility: formatProps.value ? 'visible' : 'hidden',
            }}
          />
        </InputAdornment>
      }
    />
  )
}

const AmountField = ({
  isValidAmount,
  shouldValidateAmount,
  value,
  onChange,
  label,
  className,
  currencySymbol,
}: AmountFieldProps) => {
  return (
    <FormControl
      aria-label="amount"
      error={shouldValidateAmount && !isValidAmount(value)}
      className={className}
    >
      <InputLabel htmlFor="amount-id">{label}</InputLabel>
      <NumberFormat
        prefix={`${currencySymbol} `}
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        value={value}
        customInput={IInput}
        onValueChange={(values) => onChange(values.value)}
        clearAmount={() => onChange('')}
      />
    </FormControl>
  )
}

export default AmountField
