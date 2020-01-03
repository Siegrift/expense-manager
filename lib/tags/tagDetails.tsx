import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { map } from '@siegrift/tsfunct'
import classnames from 'classnames'
import Router from 'next/router'
import React, { useState } from 'react'

import { Tag } from '../addTransaction/state'
import AmountField from '../components/amountField'
import AppBar from '../components/appBar'
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
  label: { width: '100%' },
}))

interface TagDetailsProps {
  appBarTitle: string
  tag: Tag
  onSave: (tag: Tag) => void
  onRemove?: () => void
}

const isValidDefaultAmount = (amount: string) => {
  return !amount || isAmountInValidFormat(amount)
}

const TagDetails = ({
  tag,
  appBarTitle,
  onSave,
  onRemove,
}: TagDetailsProps) => {
  const classes = useStyles()

  const [tagName, setTagName] = useState(tag.name)
  const [isAutotag, setIsAutotag] = useState(tag.automatic)
  const [amount, setAmount] = useState(
    tag.defaultAmount ? tag.defaultAmount : '',
  )
  const [shouldValidate, setShouldValidate] = useState({
    tagName: false,
    amount: false,
  })
  const onRemoveTag = () => {
    onRemove!()
    Router.push('/tags')
  }

  return (
    <>
      <AppBar
        appBarTitle={appBarTitle}
        returnUrl={'/tags'}
        onSave={() => {
          if (isValidDefaultAmount(amount) && tagName) {
            onSave({
              ...tag,
              name: tagName,
              automatic: isAutotag,
              defaultAmount: amount,
            })
            Router.push('/tags')
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
        onRemove={onRemove && onRemoveTag}
      />

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TextField fullWidth disabled label="Id" value={tag.id} />

          <TextField
            className={classes.row}
            fullWidth
            label="Tag name"
            value={tagName}
            onChange={(e) => {
              setShouldValidate((obj) => ({ ...obj, tagName: true }))
              setTagName(e.target.value)
            }}
            error={shouldValidate.tagName && tagName === ''}
          />

          <AmountField
            isValidAmount={isValidDefaultAmount}
            shouldValidateAmount={shouldValidate.amount}
            value={amount}
            onChange={(newAmount) => {
              setAmount(newAmount)
              setShouldValidate((obj) => ({ ...obj, amount: true }))
            }}
            label="Default transaction amount"
            className={classnames(classes.amount, classes.row)}
          />

          <FormControlLabel
            classes={{ root: classnames(classes.row), label: classes.label }}
            style={{ flex: 1, width: '100%' }}
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
        </Paper>
      </div>
    </>
  )
}

export default TagDetails
