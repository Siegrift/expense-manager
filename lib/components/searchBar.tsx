import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CodeIcon from '@material-ui/icons/Code'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Autocomplete from '@material-ui/lab/Autocomplete'
import classnames from 'classnames'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1) / 2,
    },
    iconButton: {
      padding: theme.spacing(1),
    },
    divider: {
      height: '60%',
    },
    invalidQuery: {
      color: 'red',
    },
    validQuery: {
      color: theme.palette.primary.main,
    },
    command: {
      textAlign: 'center',
      whiteSpace: 'nowrap',
      marginRight: theme.spacing(1) / 2,
    },
  }),
)

type Query = {
  command?: string
  value: string
}

interface SearchBarProps {
  className?: string
  placeholder: string
  commands: string[]
  valueOptions?: string[]
  query: Query
  isValidQuery: boolean
  onQueryChange: (newQuery: Query) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  commands,
  placeholder,
  query,
  onQueryChange,
  isValidQuery,
  valueOptions,
}) => {
  const classes = useStyles()
  const [showDialog, setShowDialog] = useState(false)

  return (
    <Paper className={classnames(classes.root, className)}>
      <IconButton
        className={classes.iconButton}
        onClick={() => setShowDialog(!showDialog)}
      >
        <InfoIcon color="primary" />
      </IconButton>

      {showDialog && (
        <Dialog onClose={() => setShowDialog(false)} open={showDialog}>
          <DialogTitle>Search information</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              For basic searching you can use the search bar, where you can
              search in one of the possible <b>commands</b>. Commands can be
              autocompleted, and the search is performed automatically.
            </Typography>
            <Typography gutterBottom>
              For advanced querying and filtering you can use the{' '}
              <b>search query language</b> where you can specify how, and in
              which fields you want to search.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setShowDialog(false)}
              color="primary"
            >
              Close dialog
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Autocomplete<string, false, false, true>
        size="medium"
        style={{ flex: 1 }}
        options={
          query.command === undefined
            ? commands.filter((c) => c.startsWith(query.value))
            : valueOptions !== undefined
            ? valueOptions.filter((v) => v.startsWith(query.value))
            : []
        }
        freeSolo={true}
        renderInput={(params) => {
          return (
            <InputBase
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              placeholder={query.command ? '' : placeholder}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && query.value === '') {
                  onQueryChange({ ...query, command: undefined })
                }
              }}
              startAdornment={
                query.command && (
                  <Typography
                    variant="body1"
                    component="span"
                    display="block"
                    className={classnames(
                      classes.command,
                      isValidQuery ? classes.validQuery : classes.invalidQuery,
                    )}
                  >
                    {query.command}
                  </Typography>
                )
              }
            />
          )
        }}
        onInputChange={(event, newInputVal, reason) => {
          // NOTE: for some reason this callback fires with null event and resets input value
          if (event == null) return

          if (reason === 'reset') {
            if (valueOptions) onQueryChange({ ...query, value: newInputVal })
            else onQueryChange({ command: newInputVal, value: '' })
          } else {
            if (query.command === undefined && commands.includes(newInputVal)) {
              onQueryChange({ command: newInputVal, value: '' })
            } else if (
              query.command !== undefined &&
              valueOptions &&
              valueOptions.includes(newInputVal)
            ) {
              onQueryChange({ ...query, value: newInputVal })
            } else onQueryChange({ ...query, value: newInputVal })
          }
        }}
        // NOTE: we need both values because we are switching freeSolo prop value
        value={query.value}
        inputValue={query.value}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton}>
        <CodeIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
