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
import Router from 'next/router'
import React, { useState } from 'react'

import { Tag } from '../addTransaction/state'

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

interface AddOrEditTagProps {
  returnUrl: string
  appBarTitle: string
  initialTagName: string
  initialIsAutotag: boolean
  onSave: (tag: Pick<Tag, 'name' | 'automatic'>) => void
  onRemove?: () => void
  onReturnBack?: () => void
}

const AddOrEditTag = (props: AddOrEditTagProps) => {
  const {
    onReturnBack,
    returnUrl,
    appBarTitle,
    initialTagName,
    initialIsAutotag,
    onSave,
    onRemove,
  } = props
  const classes = useStyles()

  const [tagName, setTagName] = useState(initialTagName)
  const [isAutotag, setIsAutotag] = useState(initialIsAutotag)
  const [shouldValidate, setShouldValidate] = useState(false)

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
              if (tagName) {
                onSave({ name: tagName, automatic: isAutotag })
                Router.push(returnUrl)
              } else {
                setShouldValidate(true)
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
                setShouldValidate(true)
                setTagName(e.target.value)
              }}
              error={shouldValidate && tagName === ''}
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
        </Paper>
      </div>
    </>
  )
}

export default AddOrEditTag
