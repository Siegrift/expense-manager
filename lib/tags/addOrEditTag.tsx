import AppBar from '@material-ui/core/AppBar'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import { map } from '@siegrift/tsfunct'
import Router from 'next/router'
import React, { useState } from 'react'

import { Tag } from '../addTransaction/state'
import AmountField from '../components/amountField'
import { isAmountInValidFormat } from '../shared/utils'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  amount: { width: '100%' },
  paper: {
    padding: theme.spacing(2),
  },
}))

interface AddOrEditTagProps {
  returnUrl: string
  appBarTitle: string
  initialTagName: string
  initialIsAutotag: boolean
  initialDefaultAmount?: string
  onSave: (tag: Pick<Tag, 'name' | 'automatic' | 'defaultAmount'>) => void
  onRemove?: () => void
  onReturnBack?: () => void
}

const isValidDefaultAmount = (amount: string) => {
  return !amount || isAmountInValidFormat(amount)
}

const AddOrEditTag = (props: AddOrEditTagProps) => {
  const {
    onReturnBack,
    returnUrl,
    appBarTitle,
    initialTagName,
    initialIsAutotag,
    initialDefaultAmount,
    onSave,
    onRemove,
  } = props
  const classes = useStyles()

  const [tagName, setTagName] = useState(initialTagName)
  const [isAutotag, setIsAutotag] = useState(initialIsAutotag)
  const [amount, setAmount] = useState('' + initialDefaultAmount)
  const [shouldValidate, setShouldValidate] = useState({
    tagName: false,
    amount: false,
  })

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {
              if (onReturnBack) {
                onReturnBack()
              }
              Router.push(returnUrl)
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {appBarTitle}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              if (isValidDefaultAmount(amount) && tagName) {
                onSave({
                  name: tagName,
                  automatic: isAutotag,
                  defaultAmount: amount,
                })
                Router.push(returnUrl)
              } else {
                // FIXME: tsfunct feature
                setShouldValidate(
                  // @ts-ignore
                  map(shouldValidate, (_, key) => ({
                    key,
                    value: true,
                  })),
                )
              }
            }}
          >
            <DoneIcon />
          </IconButton>
          {onRemove && (
            <IconButton
              color="inherit"
              onClick={() => {
                onRemove()
                Router.push(returnUrl)
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container className={classes.row}>
            <TextField
              fullWidth
              label="Tag name"
              value={tagName}
              onChange={(e) => {
                setShouldValidate((obj) => ({ ...obj, tagName: true }))
                setTagName(e.target.value)
              }}
              error={shouldValidate.tagName && tagName === ''}
            />
          </Grid>

          <Grid container className={classes.row}>
            <FormControlLabel
              style={{ flex: 1 }}
              control={
                <Checkbox
                  checked={isAutotag}
                  onChange={() => setIsAutotag(!isAutotag)}
                  value="checkedA"
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label="Automatic tag"
            />
          </Grid>

          <Grid container className={classes.row}>
            <AmountField
              isValidAmount={isValidDefaultAmount}
              shouldValidateAmount={shouldValidate.amount}
              value={amount}
              onChange={(newAmount) => {
                setAmount(newAmount)
                setShouldValidate((obj) => ({ ...obj, amount: true }))
              }}
              label="Default transaction amount"
              className={classes.amount}
            />
          </Grid>
        </Paper>
      </div>
    </>
  )
}

export default AddOrEditTag
