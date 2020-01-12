import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
// @ts-ignore TODO: types
import math from 'mathjs-expression-parser'
import React from 'react'

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

  return (
    <Dialog
      onClose={() => setShowCalc(false)}
      aria-labelledby="simple-dialog-title"
      open={showCalc}
    >
      <DialogContent>
        <TextField
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowCalc(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setAmount('' + (exprResult || ''))
            setShowCalc(false)
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CalculatorDialog
