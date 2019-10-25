import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import { DateTimePicker } from '@material-ui/pickers'
import { pick } from '@siegrift/tsfunct'
import Router, { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'

import { ObjectOf } from '../../lib/types'
import { Tag } from '../addTransaction/state'
import { LoadingScreen } from '../components/loading'
import TagField from '../components/tagField'
import { getCurrentUserId } from '../firebase/util'
import { tagsSel } from '../settings/selectors'
import { currencies } from '../shared/currencies'
import { useRedirectIfNotSignedIn } from '../shared/hooks'

import { removeTx, saveTxEdit } from './actions'
import { transactionByIdSel } from './selectors'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  chipField: { flex: 1 },
  amountInput: { marginLeft: theme.spacing(1) },
  row: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  amount: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  currency: { width: 105, marginLeft: theme.spacing(2) },
  paper: {
    padding: theme.spacing(2),
  },
}))

const Transactions = () => {
  const router = useRouter()
  const classes = useStyles()
  const availableTags = useSelector(tagsSel)
  // TODO: this is needed because hooks need to be called on each render
  // can be fixed by making useRedirectIfNotSignedIn a HOC
  const reduxTx = useSelector(transactionByIdSel(router.query.id as string))
  const [amount, setAmount] = useState('' + reduxTx.amount)
  const [isExpense, setIsExpense] = useState(reduxTx.isExpense)
  const [note, setNote] = useState(reduxTx.note)
  const [currency, setCurrency] = useState(reduxTx.currency)
  const [dateTime, setDateTime] = useState(reduxTx.dateTime)
  const [tagIds, setTagIds] = useState(reduxTx.tagIds)
  const [newTags, setNewTags] = useState<ObjectOf<Tag>>({})
  const [tagInputValue, setTagInputValue] = useState('')
  const dispatch = useDispatch()
  // TODO: validate that txId is a valid txs id
  const editedTxId = router.query.id as string

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => Router.push('/transactions')}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Edit transaction
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                dispatch(
                  saveTxEdit(editedTxId, newTags, {
                    amount: Number.parseFloat(amount),
                    isExpense,
                    note,
                    currency,
                    dateTime,
                    tagIds,
                  }),
                )
                Router.push('/transactions')
              }}
            >
              <DoneIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => {
                dispatch(removeTx(editedTxId))
                Router.push('/transactions')
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container className={classes.row}>
              <ButtonGroup variant="contained" fullWidth>
                <Button
                  onClick={() => setIsExpense(true)}
                  variant="contained"
                  color={isExpense ? 'primary' : 'default'}
                >
                  Expense
                </Button>
                <Button
                  onClick={() => setIsExpense(false)}
                  variant="contained"
                  color={!isExpense ? 'primary' : 'default'}
                >
                  Income
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid className={classes.row}>
              <TagField
                placeholder="Transaction tags..."
                className={classes.chipField}
                availableTags={availableTags}
                newTags={newTags}
                onSelectExistingTag={(id) => setTagIds([...tagIds, id])}
                onCreateTag={(label) => {
                  const id = uuid()
                  setNewTags({
                    ...newTags,
                    [id]: { id, name: label, uid: getCurrentUserId() },
                  })
                  setTagIds([...tagIds, id])
                }}
                onClearInputValue={() => setTagInputValue('')}
                onChangeTags={(changedTags) => {
                  const ids = changedTags.map((t) => t.id)
                  setTagIds(ids)
                  setNewTags(pick(
                    newTags,
                    ids.filter((id) => availableTags[id] == null),
                  ) as ObjectOf<Tag>)
                }}
                onSetTagInputValue={(newValue) => setTagInputValue(newValue)}
                inputValue={tagInputValue}
                currentTagIds={tagIds}
              />
            </Grid>

            <Grid container className={classes.row}>
              <Grid item className={classes.amount}>
                {/* TODO: error */}
                <FormControl aria-label="amount" error={false}>
                  <InputLabel htmlFor="amount-id">
                    Transaction amount
                  </InputLabel>
                  <Input
                    id="amount-id"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <CancelIcon
                          color="primary"
                          onClick={() => setAmount('')}
                          style={{ visibility: amount ? 'visible' : 'hidden' }}
                        />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <TextField
                  select
                  label="Currecy"
                  value={currency}
                  className={classes.currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid className={classes.row}>
              <DateTimePicker
                autoOk
                ampm={false}
                disableFuture
                value={dateTime}
                onChange={(newDateTime) => setDateTime(newDateTime as Date)}
                label="Transaction date"
                style={{ flex: 1 }}
              />
            </Grid>

            <Grid className={classes.row}>
              <TextField
                fullWidth
                label="Additional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>
          </Paper>
        </div>
      </>
    )
  }
}

export default Transactions
