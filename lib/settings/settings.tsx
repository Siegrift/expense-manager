import Button from '@material-ui/core/Button'
import { Theme, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useDispatch } from 'react-redux'

import Navigation from '../components/navigation'
import { getFirebase } from '../firebase/firebase'
import withSignedUser from '../hoc/withSignedUser'

import { clearAllData, exportToCSV, importFromCSV } from './actions'
import SettingsPanel from './settingsPanel'

function signOut() {
  // Sign out of Firebase
  getFirebase()
    .auth()
    .signOut()
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
}))

const Settings = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <>
      <Navigation />
      <div className={classes.root}>
        settings
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
            onClick={() => dispatch(clearAllData())}
          >
            Clear all expense manager data
          </Button>
        </SettingsPanel>
      </div>
    </>
  )
}

export default withSignedUser(Settings)
