import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import { useTheme } from '@material-ui/core/styles'
import CancelIcon from '@material-ui/icons/Cancel'
import React, { Suspense, useState } from 'react'
import { FaCalculator as CalculatorIcon } from 'react-icons/fa'
import NumberFormat from 'react-number-format'

const CalculatorDialog = React.lazy(() => import('./calculatorDialog'))

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
  value: string
}

const MuiInput: React.FC<MuiInputProps> = ({
  clearAmount,
  openCalculator,
  value,
  ...others
}) => {
  const theme = useTheme()

  return (
    <Input
      {...others}
      inputProps={{ inputMode: 'numeric' }}
      id="amount-id"
      placeholder="0.00"
      value={value}
      endAdornment={
        <InputAdornment position="end">
          <>
            <CancelIcon
              color="primary"
              onClick={clearAmount}
              style={{
                visibility: value ? 'visible' : 'hidden',
                marginRight: 2,
              }}
            />
            <CalculatorIcon
              color={theme.palette.primary.main}
              size={20}
              onClick={openCalculator}
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
        <Suspense fallback={null}>
          <CalculatorDialog
            calcExpression={calcExpression}
            setCalcExpression={setCalcExpression}
            showCalc={showCalc}
            setShowCalc={setShowCalc}
            setAmount={onChange}
          />
        </Suspense>
      )}
      <FormControl
        aria-label="amount"
        error={shouldValidateAmount && !isValidAmount(value)}
        className={className}
      >
        <InputLabel htmlFor="amount-id">{label}</InputLabel>
        <NumberFormat
          prefix={currencySymbol && `${currencySymbol} `}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          value={value}
          customInput={MuiInput}
          onValueChange={(values) => {
            if (values.value !== value) onChange(values.value)
          }}
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
