import React from 'react'

import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import { CURRENCIES, Currency } from '../shared/currencies'

interface CurrencySelectProps {
  onChange: (value: Currency) => void
  value: Currency
  label?: string
  className?: string
}

const CurrencySelect = ({
  value,
  onChange,
  label,
  className,
}: CurrencySelectProps) => {
  return (
    <TextField
      select
      label={label || 'Currency'}
      value={value}
      className={className}
      onChange={(e) => onChange((e.target.value as any) as Currency)}
    >
      {Object.keys(CURRENCIES).map((value) => (
        <MenuItem key={value} value={value}>
          <img
            src={`/static/${value.toLowerCase()}.png`}
            width="20"
            style={{ marginRight: 8 }}
          />
          <span style={{ verticalAlign: 'text-top' }}>{value}</span>
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CurrencySelect
