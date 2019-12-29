import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import CancelIcon from '@material-ui/icons/Cancel'
import React from 'react'

interface AmountFieldProps {
  shouldValidateAmount: boolean
  isValidAmount: (amount: string) => boolean
  value: string
  onChange: (amount: string) => void
  label: string
  className?: string
}

const AmountField = ({
  isValidAmount,
  shouldValidateAmount,
  value,
  onChange,
  label,
  className,
}: AmountFieldProps) => {
  return (
    <FormControl
      aria-label="amount"
      error={shouldValidateAmount && !isValidAmount(value)}
      className={className}
    >
      <InputLabel htmlFor="amount-id">{label}</InputLabel>
      <Input
        id="amount-id"
        type="number"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <CancelIcon
              color="primary"
              onClick={() => onChange('')}
              style={{ visibility: value ? 'visible' : 'hidden' }}
            />
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default AmountField
