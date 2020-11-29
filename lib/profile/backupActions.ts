import { getStorageRef } from '../firebase/firebase'
import { Thunk } from '../redux/types'
import {
  createSuccessNotification,
  setSnackbarNotification,
  withErrorHandler,
} from '../shared/actions'
import { UPLOADING_DATA_ERROR } from '../shared/constants'
import { currentUserIdSel } from '../shared/selectors'

import { jsonFromDataSel } from './importExportSelectors'

export const uploadBackup = (
  filename: string,
  // because we can't use the selector when doing automatic backup
  withUserId?: string,
): Thunk => async (dispatch, getState) => {
  const userId = withUserId ?? currentUserIdSel(getState())
  const jsonData = jsonFromDataSel(getState())

  withErrorHandler(UPLOADING_DATA_ERROR, dispatch, async () => {
    await getStorageRef(userId!, 'backup', filename).putString(jsonData)
    dispatch(
      setSnackbarNotification(createSuccessNotification('Backup successful')),
    )
  })
}

export const removeFiles = (filenames: string[]): Thunk => async (
  dispatch,
  getState,
) => {
  const userId = currentUserIdSel(getState())

  const storageRef = getStorageRef(userId!, 'backup')
  const promises = filenames.map((filename) =>
    storageRef.child(filename).delete(),
  )

  // wait for completion, TODO: maybe show loading overlay
  withErrorHandler(UPLOADING_DATA_ERROR, dispatch, async () => {
    await Promise.all(promises)
    dispatch(
      setSnackbarNotification(
        createSuccessNotification('Selected file(s) were successfully removed'),
      ),
    )
  })
}
