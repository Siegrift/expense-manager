import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import math from 'mathjs-expression-parser'

interface CalculatorDialogProps {
  setShowCalc: (open: boolean) => void
  showCalc: boolean
  calcExpression: string
  setCalcExpression: (exp: string) => void
  setAmount: (amount: string) => void
}

const CalculatorDialog = ({
  calcExpression,
  setCalcExpression,
  setShowCalc,
  showCalc,
  setAmount,
}: CalculatorDialogProps) => {
  let exprResult: number | null
  try {
    exprResult = math.eval(calcExpression)
  } catch {
    exprResult = null
  }

  const onOk = () => {
    setAmount('' + (exprResult || ''))
    setShowCalc(false)
  }

  return (
    <Dialog
      onClose={() => setShowCalc(false)}
      aria-labelledby="simple-dialog-title"
      disableEnforceFocus
      onEscapeKeyDown={() => setShowCalc(false)}
      onEntered={() => document.getElementById('calculator-textfield')?.focus()}
      open={showCalc}
    >
      <DialogContent>
        <TextField
          id="calculator-textfield"
          autoFocus
          inputProps={{ inputMode: 'numeric' }}
          fullWidth
          error={exprResult === null}
          label="Expression"
          value={calcExpression}
          onChange={(e) => setCalcExpression(e.target.value)}
          helperText={
            exprResult === null
              ? 'Malformed expression'
              : `Result: ${exprResult || ''}`
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') onOk()
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowCalc(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CalculatorDialog
