import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import CancelIcon from '@material-ui/icons/Cancel'
// TODO: replace with proper calculator icon when material ui will have it
import CalculatorIcon from '@material-ui/icons/Functions'
import { omit } from '@siegrift/tsfunct'
import React, { useState } from 'react'
import NumberFormat from 'react-number-format'
import CalculatorDialog from './calculatorDialog'

interface AmountFieldProps {
  shouldValidateAmount: boolean
  isValidAmount: (amount: string) => boolean
  value: string
  onChange: (amount: string) => void
  label: string
  className?: string
  currencySymbol?: string
}

interface MuiInputProps {
  clearAmount: () => void
  openCalculator: () => void
}

const MuiInput = (formatProps: any & MuiInputProps) => {
  return (
    <Input
      {...omit(formatProps, ['clearAmount', 'openCalculator'])}
      id="amount-id"
      placeholder="0.00"
      value={formatProps.value}
      endAdornment={
        <InputAdornment position="end">
          <>
            <CancelIcon
              color="primary"
              onClick={formatProps.clearAmount}
              style={{
                visibility: formatProps.value ? 'visible' : 'hidden',
              }}
            />
            <CalculatorIcon
              color="primary"
              onClick={formatProps.openCalculator}
            />
          </>
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
  const [showCalc, setShowCalc] = useState(false)
  const [calcExpression, setCalcExpression] = useState('')

  return (
    <>
      {showCalc && (
        <CalculatorDialog
          calcExpression={calcExpression}
          setCalcExpression={setCalcExpression}
          showCalc={showCalc}
          setShowCalc={setShowCalc}
          setAmount={onChange}
        />
      )}
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
          customInput={MuiInput}
          onValueChange={(values) => onChange(values.value)}
          clearAmount={() => onChange('')}
          openCalculator={() => {
            setCalcExpression(value)
            setShowCalc(true)
          }}
        />
      </FormControl>
    </>
  )
}

export default AmountField
