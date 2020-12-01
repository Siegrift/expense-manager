import React from 'react'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Collapse from '@material-ui/core/Collapse'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Cancel'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { DateTimePicker } from '@material-ui/pickers'
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone'
import Highlight from 'react-highlight.js'
import { useSelector, useDispatch } from 'react-redux'

import { RepeatingOption, RepeatingOptions, Tag } from '../addTransaction/state'
import AmountField from '../components/amountField'
import { Loading } from '../components/loading'
import Paper from '../components/paper'
import TagField from '../components/tagField'
import { getStorageRef } from '../firebase/firebase'
import { setSnackbarNotification, withErrorHandler } from '../shared/actions'
import { DEFAULT_DATE_FORMAT } from '../shared/constants'
import { Currency, CURRENCIES } from '../shared/currencies'
import { useFirebaseLoaded } from '../shared/hooks'
import {
  mainCurrencySel,
  exchangeRatesSel,
  currentUserIdSel,
} from '../shared/selectors'
import { useRefreshExchangeRates } from '../shared/transaction/useRefreshExchangeRates'
import {
  areDistinct,
  computeExchangeRate,
  downloadTextFromUrl,
} from '../shared/utils'
import { ObjectOf } from '../types'

import CurrencySelect from './currencySelect'

const useStyles = makeStyles((theme: Theme) => ({
  chipField: { flex: 1 },
  amountInput: { marginLeft: theme.spacing(1) },
  row: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  paper: {
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  amount: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  currency: { width: 105, marginLeft: theme.spacing(2) },
  dropzoneText: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    display: 'inline-block',
    verticalAlign: 'top',
    marginRight: 8,
  },
  dropzone: { minHeight: 0 },
  dropzoneIcon: { width: 25, height: 25, marginTop: 8 },
  dropzonePreviewRemoveButton: { margin: 0 },
  dropzonePreviewImageContainer: {
    padding: 0,
    flexBasis: 'unset',
    '& > svg': { padding: 16 },
  },
  showFileDialogPaper: { width: '100%', maxWidth: 'unset' },
}))

type FieldProps<T> = {
  value: T
  handler: (newValue: T) => void
}
type FieldPropsWithValidation<T> = FieldProps<T> & {
  isValid: (value: T) => boolean
  validate: boolean
}

interface BaseProps {
  isExpense: FieldProps<boolean>
  tagProps: {
    tags: ObjectOf<Tag>
    currentTagIds: string[]
    onSelectTag: (id: string) => void
    onCreateTag: (tag: Tag) => void
    onRemoveTags: (tagIds: string[]) => void
    value: string
    onValueChange: (newValue: string) => void
  }
  amount: FieldPropsWithValidation<string>
  currency: FieldProps<Currency>
  dateTime: FieldProps<Date | undefined | null>
  repeating: FieldProps<RepeatingOption>
  note: FieldProps<string>
  attachedFileObjects: FieldProps<FileObject[]>
  onSubmit: (e: React.SyntheticEvent) => void
}

type AddTxFormVariantProps = {
  variant: 'add'
  useCurrentTime: FieldProps<boolean>
}

type EditTxFormVariantProps = {
  variant: 'edit'
  uploadedFiles: FieldProps<string[]>
  id: string
}

type VariantProps = AddTxFormVariantProps | EditTxFormVariantProps

type TransactionFormProps = BaseProps & VariantProps

interface ShowFileContent {
  filename: string
  rawContent?: string
  imageUrl?: string
}

const FileContent = ({ rawContent, imageUrl, filename }: ShowFileContent) => {
  if (!rawContent && !imageUrl) return <>Loading...</>

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={filename}
        width="100%"
        style={{ width: '100%' }}
      />
    )
  }

  const suffix = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase()

  if (suffix === 'html' || suffix === 'htm') {
    return (
      <iframe
        srcDoc={rawContent}
        style={{ width: '100%', height: '60vh' }}
      ></iframe>
    )
  } else {
    return <Highlight language={suffix}>{rawContent}</Highlight>
  }
}

const TransactionForm = (props: TransactionFormProps) => {
  const {
    variant,
    tagProps,
    isExpense,
    amount,
    currency,
    dateTime,
    onSubmit,
    repeating,
    note,
    attachedFileObjects,
  } = props
  const useCurrentTime =
    variant === 'add' && (props as AddTxFormVariantProps).useCurrentTime
  const uploadedFiles =
    variant === 'edit' && (props as EditTxFormVariantProps).uploadedFiles
  const txId = variant === 'edit' && (props as EditTxFormVariantProps).id

  const classes = useStyles()

  const mainCurrency = useSelector(mainCurrencySel)
  const exchangeRates = useSelector(exchangeRatesSel)
  const userId = useSelector(currentUserIdSel)
  const settingsLoaded = useFirebaseLoaded()
  const dispatch = useDispatch()
  const [
    showUploadedFile,
    setShowUploadedFile,
  ] = React.useState<null | ShowFileContent>(null)

  const { loading, error } = useRefreshExchangeRates()

  let filteredRepeatingOptions = Object.keys(RepeatingOptions)
  if (variant === 'add') {
    filteredRepeatingOptions = filteredRepeatingOptions.filter(
      (op) => op !== RepeatingOptions.inactive,
    )
  }

  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.row}>
        <ButtonGroup variant="contained" fullWidth>
          <Button
            onClick={() => isExpense.handler(true)}
            variant="contained"
            color={isExpense.value ? 'primary' : 'default'}
          >
            Expense
          </Button>
          <Button
            onClick={() => isExpense.handler(false)}
            variant="contained"
            color={!isExpense.value ? 'primary' : 'default'}
          >
            Income
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid className={classes.row}>
        <TagField
          tags={tagProps.tags}
          onSelectTag={tagProps.onSelectTag}
          onCreateTag={tagProps.onCreateTag}
          onSetTagInputValue={tagProps.onValueChange}
          onRemoveTags={tagProps.onRemoveTags}
          inputValue={tagProps.value}
          currentTagIds={tagProps.currentTagIds}
        />
      </Grid>

      <Grid container className={classes.row}>
        <AmountField
          isExpense={isExpense.value}
          currency={CURRENCIES[currency.value]}
          isValidAmount={amount.isValid}
          shouldValidateAmount={amount.validate}
          label="Transaction amount"
          value={amount.value}
          onChange={amount.handler}
          onPressEnter={onSubmit}
        />

        <CurrencySelect
          value={currency.value}
          className={classes.currency}
          onChange={currency.handler}
        />
      </Grid>

      <Collapse in={currency.value !== mainCurrency} style={{ margin: 0 }}>
        <Grid className={classes.row} style={{ flexWrap: 'wrap' }}>
          {settingsLoaded && (
            <>
              <Typography variant="caption">
                {(parseFloat(amount.value) || 0).toFixed(
                  CURRENCIES[currency.value].scale,
                )}{' '}
                {currency.value}
                {' = '}
                <b>
                  {(
                    (parseFloat(amount.value) || 0) *
                    computeExchangeRate(
                      exchangeRates!.rates,
                      currency.value,
                      mainCurrency!,
                    )
                  ).toFixed(CURRENCIES[mainCurrency!].scale)}{' '}
                  {mainCurrency}
                </b>
              </Typography>
              <Typography variant="caption" style={{ marginLeft: 8 }}>
                <i>(rates from {exchangeRates!.date})</i>
              </Typography>
            </>
          )}
          {loading && (
            <Typography variant="caption">
              <Loading
                size={15}
                imageStyle={{ display: 'inline', marginTop: '2px' }}
              />
              <span style={{ marginLeft: 4, verticalAlign: 'super' }}>
                Loading fresh exchange rates
              </span>
            </Typography>
          )}
          {error && (
            <Typography variant="caption" style={{ color: 'red' }}>
              <ErrorOutlineIcon fontSize="small" />
              <span style={{ marginLeft: 4, verticalAlign: 'super' }}>
                Couldn't refresh exchange rates
              </span>
            </Typography>
          )}
        </Grid>
      </Collapse>

      <Grid className={classes.row}>
        <TextField
          fullWidth
          label="Note"
          value={note.value}
          onChange={(e) => note.handler(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(e)
          }}
        />
      </Grid>

      {useCurrentTime && (
        <>
          <Grid className={classes.row} style={{ justifyContent: 'start' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useCurrentTime.value}
                  onChange={() => {
                    useCurrentTime.handler(!useCurrentTime.value)
                  }}
                  color="primary"
                />
              }
              label="Use current date and time"
            />
          </Grid>

          {/* override margin set by parent component */}
          <Collapse in={!useCurrentTime.value} style={{ margin: 0 }}>
            <Grid className={classes.row}>
              <DateTimePicker
                inputFormat={DEFAULT_DATE_FORMAT}
                ampm={false}
                disableFuture
                value={dateTime.value}
                onChange={dateTime.handler}
                label="Transaction date"
                renderInput={(props) => (
                  <TextField {...props} style={{ flex: 1 }} />
                )}
              />
            </Grid>
          </Collapse>
        </>
      )}

      {variant === 'edit' && (
        <Grid className={classes.row}>
          <DateTimePicker
            inputFormat={DEFAULT_DATE_FORMAT}
            ampm={false}
            disableFuture
            value={dateTime.value}
            onChange={dateTime.handler}
            label="Transaction date"
            renderInput={(props) => (
              <TextField {...props} style={{ flex: 1 }} />
            )}
          />
        </Grid>
      )}

      <Grid className={classes.row}>
        <FormControl style={{ flex: 1 }}>
          <InputLabel htmlFor="tx-repeating">Repeating</InputLabel>
          <Select
            value={repeating.value}
            onChange={(e) => repeating.handler(e.target.value as any)}
            inputProps={{
              name: 'repeating',
              id: 'tx-repeating',
            }}
          >
            {filteredRepeatingOptions.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {uploadedFiles && (
        <List
          dense
          subheader={
            <ListSubheader style={{ padding: 0, fontSize: 'small' }}>
              Already uploaded files
            </ListSubheader>
          }
        >
          {uploadedFiles.value.map((filename) => (
            <ListItem
              key={filename}
              button
              onClick={() => {
                setShowUploadedFile({ filename })
                const success = withErrorHandler(
                  'Unable to download file content',
                  dispatch,
                  async () => {
                    const ref = getStorageRef(
                      userId!,
                      'files',
                      txId as string,
                      filename,
                    )
                    const url = await ref.getDownloadURL()

                    const type = (await ref.getMetadata())?.contentType
                    if (typeof type === 'string' && type.startsWith('image')) {
                      setShowUploadedFile({ filename, imageUrl: url })
                      return true
                    }

                    const rawContent = await downloadTextFromUrl(url)
                    setShowUploadedFile({ filename, rawContent })
                    return true /* success */
                  },
                )

                if (!success)
                  setShowUploadedFile({
                    filename,
                    rawContent: 'Unexpected error while downloading file!',
                  })
              }}
            >
              <ListItemText primary={filename} />
              <ListItemSecondaryAction style={{ right: 0 }}>
                <IconButton
                  color="primary"
                  onClick={() =>
                    uploadedFiles.handler(
                      uploadedFiles.value.filter((f) => f !== filename),
                    )
                  }
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {showUploadedFile && (
        <Dialog
          onClose={() => setShowUploadedFile(null)}
          open={true}
          classes={{ paper: classes.showFileDialogPaper }}
        >
          <DialogTitle>{`Attached file - ${showUploadedFile.filename}`}</DialogTitle>
          <DialogContent dividers>
            <FileContent {...showUploadedFile} />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setShowUploadedFile(null)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <DropzoneAreaBase
        showFileNames={true}
        filesLimit={5}
        fileObjects={attachedFileObjects.value}
        onAdd={(newFileObjects) => {
          let filenames = newFileObjects.map((f) => f.file.name)
          if (uploadedFiles) {
            filenames = filenames.concat(uploadedFiles.value)
          }

          if (!areDistinct(filenames)) {
            dispatch(
              setSnackbarNotification({
                message: 'Detected multiple files with same filenames!',
                severity: 'warning',
              }),
            )
          } else {
            attachedFileObjects.handler([
              ...attachedFileObjects.value,
              ...newFileObjects,
            ])
          }
        }}
        onDelete={(_fileObj, index) =>
          attachedFileObjects.handler(
            attachedFileObjects.value.filter((_, i) => i !== index),
          )
        }
        showAlerts={false} // turning this to true breaks application
        classes={{
          text: classes.dropzoneText,
          icon: classes.dropzoneIcon,
          root: classes.dropzone,
        }}
        previewGridClasses={{
          container: classes.dropzonePreviewRemoveButton,
          item: classes.dropzonePreviewImageContainer,
        }}
        dropzoneText="Drag and drop file(s) or click to choose"
        onAlert={(message, severity) => {
          if (severity === 'error')
            dispatch(setSnackbarNotification({ message, severity }))
        }}
      />

      {variant === 'add' && (
        <Grid className={classes.row}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onSubmit}
            aria-label="add transaction"
          >
            Add transaction
          </Button>
        </Grid>
      )}
    </Paper>
  )
}

export default TransactionForm
