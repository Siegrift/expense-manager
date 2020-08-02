import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import { useDispatch } from 'react-redux'

import ConfirmDialog from '../components/confirmDialog'
import PageWrapper from '../components/pageWrapper'
import { getFirebase } from '../firebase/firebase'

import { clearAllData, exportToCSV, importFromCSV } from './actions'
import SettingsPanel from './settingsPanel'

async function signOut() {
  // Sign out of Firebase
  await getFirebase().auth().signOut()
}

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginBottom: theme.spacing(1),
  },
}))

const Settings = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [deleteAllDataDialogOpen, setDeleteAllDataDialogOpen] = useState(false)

  useEffect(() => {
    // Prefetch the /add page as the user will go there after the login
    // see: firebase.ts
    Router.prefetch('/add')
  }, [])

  return (
    <PageWrapper>
      <button onClick={signOut} aria-label="sign out">
        google sign out
      </button>
      <SettingsPanel name="import and export">
        <input
          id="choose-import-file"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => dispatch(importFromCSV(e))}
        />
        <label htmlFor="choose-import-file">
          <Button
            variant="contained"
            className={classes.button}
            fullWidth
            color="primary"
            aria-label="import from csv file"
            component="span"
          >
            Import from csv file
          </Button>
        </label>

        <Button
          variant="contained"
          className={classes.button}
          fullWidth
          color="primary"
          aria-label="export to csv file"
          onClick={() => dispatch(exportToCSV())}
        >
          Export to csv file
        </Button>
      </SettingsPanel>
      <SettingsPanel name="clear data">
        <Button
          variant="contained"
          className={classes.button}
          fullWidth
          color="secondary"
          aria-label="clear data"
          onClick={() => setDeleteAllDataDialogOpen(true)}
        >
          Clear all expense manager data
        </Button>
      </SettingsPanel>
      <ConfirmDialog
        open={deleteAllDataDialogOpen}
        onConfirm={() => {
          dispatch(clearAllData())
          setDeleteAllDataDialogOpen(false)
        }}
        onCancel={() => setDeleteAllDataDialogOpen(false)}
        title="Clear all user data"
        ContentComponent={
          <>
            <p>Are you sure you want to clear all expense manager data?</p>
            <b>You will not be able to revert this option!</b>
          </>
        }
      />
    </PageWrapper>
  )
}

export default Settings
