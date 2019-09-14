import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
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
import { map, omit, pick } from '@siegrift/tsfunct'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import makeAnimated from 'react-select/animated'
import Select from 'react-select/creatable'

import {
  createNewTag,
  setAmount,
  setCurrency,
  setTags,
  setTagInputValue
} from '../lib/actions/addTransaction'
import { currencies } from '../lib/currencies'
import Navigation from '../lib/shared/Navigation'
import { State, Tag } from '../lib/state'

const animatedComponents = makeAnimated()

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    chipField: { alignSelf: 'stretch' },
    amountInput: { marginLeft: theme.spacing(1) },
    amount: {
      display: 'flex',
      alignSelf: 'stretch',
      // to make it look like nicer
      marginLeft: '3px',
      marginTop: '16px',
    },
    currency: { width: 105, marginLeft: theme.spacing(2) },
  }),
)

interface ReactSelectTag {
  value: string
  label: string
  rawTag: Tag
}

const convertTagToReactSelectTag = (tag: Tag) => ({
  value: tag.name,
  label: tag.name,
  rawTag: tag,
})

const convertReactSelectTagToTag = (tag: ReactSelectTag) => tag.rawTag

const AddTransaction = () => {
  const [value, setValue] = useState(0)
  const classes = useStyles()
  const dispatch = useDispatch()

  const { amount, currency, tags, tagInputValue } = useSelector(
    (state: State) => state.addTransaction,
  )
  const availableTags = useSelector((state: State) => state.availableTags)
  const suggestedTags: ReactSelectTag[] = Object.entries(availableTags).map(
    ([id, tag]) => convertTagToReactSelectTag(tag),
  )
  const currentTags: ReactSelectTag[] = Object.entries(tags).map(([id, tag]) =>
    convertTagToReactSelectTag(tag),
  )

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
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
        onChange={(newTags) =>
          dispatch(
            setTags(
              newTags === null
                ? []
                : (newTags as ReactSelectTag[]).map(convertReactSelectTagToTag),
            ),
          )
        }
        onInputChange={(newValue) => dispatch(setTagInputValue(newValue))}
        inputValue={tagInputValue}
        value={currentTags}
      />

      <Grid container>
        <Grid item className={classes.amount}>
          <FormControl>
            <InputLabel htmlFor="amount-id">Transaction amount</InputLabel>
            <Input
              id="amount-id"
              type="text"
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
            label="Select currecy"
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

      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      <Navigation />
    </Grid>
  )
}

export default AddTransaction
