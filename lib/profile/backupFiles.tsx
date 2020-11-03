import React from 'react'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import BackupIcon from '@material-ui/icons/Backup'
import UnselectAllIcon from '@material-ui/icons/ClearAll'
import DeleteIcon from '@material-ui/icons/Delete'
import SelectAllIcon from '@material-ui/icons/DoneAll'
import DownloadIcon from '@material-ui/icons/GetApp'
import Alert from '@material-ui/lab/Alert'
import { update } from '@siegrift/tsfunct'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import parse from 'date-fns/parse'
import Highlight from 'react-highlight.js'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmDialog from '../components/confirmDialog'
import Loading from '../components/loading'
import { getFirebase } from '../firebase/firebase'
import {
  createErrorNotification,
  createSuccessNotification,
  setSnackbarNotification,
  withErrorHandler,
} from '../shared/actions'
import {
  REQUEST_TIMEOUT_ERROR,
  UPLOADING_DATA_ERROR,
} from '../shared/constants'
import { currentUserIdSel, firebaseLoadedSel } from '../shared/selectors'
import { delay, downloadTextFromUrl, downloadFile } from '../shared/utils'

import { jsonFromDataSel } from './importExportSelectors'

const BACKUP_FILENAME_FORMAT = 'dd.MM.yyyy - HH:mm:ss'

const useStyles = makeStyles((theme: Theme) => ({
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  showFileDialogPaper: {
    width: '100%',
  },
}))

interface ListItemData {
  filename: string
  checked: boolean
}

interface ShowFileContent {
  filename: string
  content: string | null | undefined
}

const BackupFilesList = () => {
  const classes = useStyles()
  const [listItems, setListItems] = React.useState<
    ListItemData[] | null | undefined
  >(undefined)
  const firebaseLoaded = useSelector(firebaseLoadedSel)
  const userId = useSelector(currentUserIdSel)
  const jsonData = useSelector(jsonFromDataSel)
  const dispatch = useDispatch()
  const [showRemoveFileDialog, setShowRemoveFileDialog] = React.useState(false)
  const [showFile, setShowFile] = React.useState<ShowFileContent | null>(null)

  const somethingSelected = !!listItems && !listItems.find((i) => i.checked)

  const handleToggle = (index: number) => () => {
    setListItems(update(listItems!, [index, 'checked'], (val) => !val))
  }

  React.useEffect(() => {
    if (!firebaseLoaded) return

    setListItems(null)
    const storageRef = getFirebase().storage().ref()
    const listFilesPromise = storageRef
      .child(userId!)
      .listAll()
      .then(function (res) {
        return res.items.map((itemRef) => {
          return itemRef.name
        })
      })

    Promise.all([
      Promise.race([listFilesPromise, delay(5 * 1000)]), // max wait time is 5s
      delay(1000), // min wait time is 1s
    ])
      .then((data) => {
        if (data[0]) {
          const d = data[0] as string[]
          d.sort((d1, d2) => {
            const base = new Date()
            const dd1 = parse(d1, BACKUP_FILENAME_FORMAT, base)
            const dd2 = parse(d2, BACKUP_FILENAME_FORMAT, base)
            return isBefore(dd1, dd2) ? 1 : -1
          })
          setListItems(d.map((str) => ({ filename: str, checked: false })))
        } else {
          dispatch(
            setSnackbarNotification(
              createErrorNotification(REQUEST_TIMEOUT_ERROR),
            ),
          )
        }
      })
      .catch((error) => {
        dispatch(
          setSnackbarNotification(
            createErrorNotification(UPLOADING_DATA_ERROR),
            error,
          ),
        )
      })
  }, [firebaseLoaded])

  if (!firebaseLoaded || listItems === undefined) return null
  else if (listItems === null)
    return (
      <Loading
        size={100}
        text="Loading backup files..."
        textStyle={{ fontSize: '2.0em' }}
      />
    )
  else {
    return (
      <>
        <List dense>
          {listItems.map(({ filename, checked }, index) => {
            return (
              <ListItem
                key={filename}
                button
                onClick={() => {
                  setShowFile({ filename, content: undefined })
                  const success = withErrorHandler(
                    'Unable to download file content',
                    dispatch,
                    async () => {
                      const storageRef = getFirebase()
                        .storage()
                        .ref()
                        .child(userId!)

                      const content = await downloadTextFromUrl(
                        await storageRef.child(filename).getDownloadURL(),
                      )

                      setShowFile({ filename, content })
                    },
                  )

                  if (!success) setShowFile({ filename, content: null })
                }}
              >
                <ListItemText primary={filename} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(index)}
                    checked={checked}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
          <Divider />

          <div className={classes.buttonsWrapper}>
            <div className={classes.buttons}>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<SelectAllIcon />}
                onClick={() => {
                  const firstInd = listItems.findIndex((item) => item.checked)
                  setListItems(
                    listItems.map((item, i) =>
                      i < firstInd ? item : { ...item, checked: true },
                    ),
                  )
                }}
                disabled={somethingSelected}
              >
                Select older
              </Button>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<UnselectAllIcon />}
                onClick={() => {
                  setListItems(
                    listItems.map((item) => ({ ...item, checked: false })),
                  )
                }}
                disabled={somethingSelected}
              >
                Unselect all
              </Button>

              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={() => {
                  const storageRef = getFirebase()
                    .storage()
                    .ref()
                    .child(userId!)
                  const filename = format(new Date(), BACKUP_FILENAME_FORMAT)

                  withErrorHandler(UPLOADING_DATA_ERROR, dispatch, async () => {
                    await storageRef.child(filename).putString(jsonData)
                    setListItems([{ filename, checked: false }, ...listItems])
                    dispatch(
                      setSnackbarNotification(
                        createSuccessNotification('Backup successful'),
                      ),
                    )
                  })
                }}
              >
                Backup now
              </Button>
            </div>

            <div className={classes.buttons}>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => setShowRemoveFileDialog(true)}
                disabled={somethingSelected}
              >
                Remove
              </Button>
              <Button
                size="small"
                color="primary"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const storageRef = getFirebase()
                    .storage()
                    .ref()
                    .child(userId!)
                  listItems.forEach(async (item) => {
                    if (item.checked) {
                      const text = await downloadTextFromUrl(
                        await storageRef.child(item.filename).getDownloadURL(),
                      )
                      downloadFile(item.filename, text)
                    }
                  })
                }}
                disabled={somethingSelected}
              >
                Download
              </Button>
            </div>
          </div>
        </List>

        <ConfirmDialog
          onConfirm={(e) => {
            e.stopPropagation()

            const storageRef = getFirebase().storage().ref().child(userId!)
            const promises = listItems
              .filter(({ checked }) => checked)
              .map((item) => storageRef.child(item.filename).delete())

            // wait for completion, TODO: maybe show loading overlay
            withErrorHandler(UPLOADING_DATA_ERROR, dispatch, async () => {
              await Promise.all(promises)
              // delete the removed ones from state
              const preserved = listItems.filter(({ checked }) => !checked)
              setListItems(preserved)

              dispatch(
                setSnackbarNotification(
                  createSuccessNotification(
                    'Selected files were successfully removed',
                  ),
                ),
              )
            })

            setShowRemoveFileDialog(false)
          }}
          onCancel={() => setShowRemoveFileDialog(false)}
          title="Do you really want to remove this file(s)?"
          open={showRemoveFileDialog}
          ContentComponent="You won't be able to undo this action"
        />

        {showFile && (
          <Dialog
            onClose={() => setShowFile(null)}
            open={true}
            classes={{ paper: classes.showFileDialogPaper }}
          >
            <DialogTitle>{`Backup - ${showFile.filename}`}</DialogTitle>
            <DialogContent dividers>
              <Highlight language="json">
                {showFile.content ?? 'Loading...'}
              </Highlight>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => setShowFile(null)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    )
  }
}

const BackupFiles = () => {
  return (
    <>
      <Alert
        severity="info"
        style={{ marginBottom: 8, textTransform: 'initial' }}
      >
        Data is automatically saved every <b>7 days</b>{' '}
        <i>(maybe more if there are no changes in the data)</i>.
      </Alert>
      <BackupFilesList />
    </>
  )
}

export default BackupFiles
