import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmDialog from '../components/confirmDialog'
import CurrencySelect from '../components/currencySelect'
import Loading from '../components/loading'
import PageWrapper from '../components/pageWrapper'
import { getFirebase } from '../firebase/firebase'
import { settingsSel } from '../shared/selectors'

import {
  clearAllData,
  exportToCSV,
  importFromCSV,
  changeDefaultCurrency,
  changeMainCurrency,
} from './actions'
import SettingsPanel from './settingsPanel'

async function signOut() {
  // Sign out of Firebase
  await getFirebase().auth().signOut()
}

const useStyles = makeStyles((theme: Theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
}))

const Settings = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [deleteAllDataDialogOpen, setDeleteAllDataDialogOpen] = useState(false)
  const settings = useSelector(settingsSel)

  return (
    <PageWrapper>
      <button onClick={signOut} aria-label="sign out">
        google sign out
      </button>
      <SettingsPanel name="settings">
        {!settings && <Loading />}
        {settings && (
          <>
            <CurrencySelect
              value={settings.mainCurrency}
              onChange={(curr) => dispatch(changeMainCurrency(curr))}
              label="Main currency"
              className={classes.marginBottom}
            />
            <CurrencySelect
              value={settings.defaultCurrency}
              onChange={(curr) => dispatch(changeDefaultCurrency(curr))}
              label="Default currency"
            />
          </>
        )}
      </SettingsPanel>

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
            className={classes.marginBottom}
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
          className={classes.marginBottom}
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
          className={classes.marginBottom}
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
