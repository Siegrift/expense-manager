import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import CancelIcon from '@material-ui/icons/Cancel'
import DirectionsIcon from '@material-ui/icons/Directions'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import LabelIcon from '@material-ui/icons/Label'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { DateTimePicker } from '@material-ui/pickers'
import { map, omit, pick } from '@siegrift/tsfunct'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import uuid from 'uuid/v4'

import {
  addTransaction,
  createNewTag,
  setAmount,
  setCurrency,
  setDateTime,
  setIsExpense,
  setNote,
  setTags,
  setTagInputValue
} from '../lib/addTransaction/actions'
import { Tag } from '../lib/addTransaction/state'
import { currencies } from '../lib/currencies'
import Navigation from '../lib/shared/Navigation'
import { State } from '../lib/state'
import { ObjectOf } from '../lib/types'

const animatedComponents = makeAnimated()

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      // TODO: hide bottom navigation when kayboard is shown
      marginBottom: 60,
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
      padding: 16,
    },
  }),
)

interface ReactSelectTag {
  value: string
  label: string
  tagId: string
}

const convertTagToReactSelectTag = (tag: Tag): ReactSelectTag => ({
  value: tag.name,
  label: tag.name,
  tagId: tag.id,
})

const convertReactSelectTagToTag = (
  allTags: ObjectOf<Tag>,
  tag: ReactSelectTag,
): Tag => allTags[tag.tagId]

const AddTransaction = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const {
    amount,
    currency,
    tagIds,
    newTags,
    tagInputValue,
    isExpense,
    note,
    dateTime,
  } = useSelector((state: State) => state.addTransaction)
  const availableTags = useSelector((state: State) => state.availableTags)
  const allTags = { ...availableTags, ...newTags }
  const suggestedTags: ReactSelectTag[] = Object.values(availableTags).map(
    convertTagToReactSelectTag,
  )
  const currentTags: ReactSelectTag[] = tagIds.map((id) =>
    convertTagToReactSelectTag(allTags[id]),
  )

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Paper className={classes.paper}>
        <Grid container className={classes.row}>
          <ButtonGroup variant="contained" fullWidth>
            <Button
              onClick={() => dispatch(setIsExpense(true))}
              variant="contained"
              color={isExpense ? 'primary' : 'default'}
            >
              Expense
            </Button>
            <Button
              onClick={() => dispatch(setIsExpense(false))}
              variant="contained"
              color={!isExpense ? 'primary' : 'default'}
            >
              Income
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid className={classes.row}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            placeholder="Transaction tags..."
            isMulti
            options={suggestedTags}
            className={classes.chipField}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'Enter':
                case 'Tab':
                  dispatch(createNewTag(tagInputValue))
                  e.preventDefault()
              }
            }}
            onChange={(changedTags: any) =>
              dispatch(
                setTags(
                  changedTags === null
                    ? []
                    : (changedTags as ReactSelectTag[]).map((tag) =>
                        convertReactSelectTagToTag(allTags, tag),
                      ),
                ),
              )
            }
            onInputChange={(newValue) => dispatch(setTagInputValue(newValue))}
            inputValue={tagInputValue}
            value={currentTags}
          />
        </Grid>

        <Grid container className={classes.row}>
          <Grid item className={classes.amount}>
            <FormControl>
              <InputLabel htmlFor="amount-id">Transaction amount</InputLabel>
              <Input
                id="amount-id"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => dispatch(setAmount(e.target.value))}
                endAdornment={
                  <InputAdornment position="end">
                    <CancelIcon
                      color="primary"
                      onClick={() => dispatch(setAmount(''))}
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
              onChange={(e) => dispatch(setCurrency(e.target.value))}
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
            onChange={(newDateTime) => dispatch(setDateTime(newDateTime as Date))}
            label="Transaction date"
            style={{ flex: 1 }}
          />
        </Grid>

        <Grid className={classes.row}>
          <TextField
            fullWidth
            label="Additional note"
            value={note}
            onChange={(e) => dispatch(setNote(e.target.value))}
          />
        </Grid>

        <Grid className={classes.row}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            // TODO: validate we can add transaction
            onClick={() => dispatch(addTransaction())}
          >
            Add transaction
          </Button>
        </Grid>
      </Paper>
      <Navigation />
    </Grid>
  )
}

export default AddTransaction
