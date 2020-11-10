import { isBefore, parse, format } from 'date-fns'

import { getFirebase } from '../firebase/firebase'
import { REQUEST_TIMEOUT_ERROR } from '../shared/constants'
import { delay, downloadFile, downloadTextFromUrl } from '../shared/utils'

export const AUTO_BACKUP_PERIOD_DAYS = 7
export const BACKUP_FILENAME_FORMAT = 'dd.MM.yyyy - HH:mm:ss'

export const listFirestoreFilesForUser = (userId: string) => {
  const storageRef = getFirebase().storage().ref()
  const listFilesPromise = storageRef
    .child(userId!)
    .listAll()
    .then(function (res) {
      return res.items.map((itemRef) => {
        return itemRef.name
      })
    })

  return Promise.all([
    Promise.race([listFilesPromise, delay(5 * 1000)]), // max wait time is 5s
    delay(1000), // min wait time is 1s
  ]).then((data) => {
    if (data[0]) {
      const d = data[0] as string[]
      return d.sort((d1, d2) => {
        const base = new Date()
        const dd1 = parse(d1, BACKUP_FILENAME_FORMAT, base)
        const dd2 = parse(d2, BACKUP_FILENAME_FORMAT, base)
        return isBefore(dd1, dd2) ? 1 : -1
      })
    } else {
      return REQUEST_TIMEOUT_ERROR
    }
  })
}

export const firestoreFileContent = async (
  userId: string,
  filename: string,
) => {
  const storageRef = getFirebase().storage().ref().child(userId)

  return await downloadTextFromUrl(
    await storageRef.child(filename).getDownloadURL(),
  )
}

export const createFirestoreFilename = () =>
  format(new Date(), BACKUP_FILENAME_FORMAT)

export const downloadFiles = (userId: string, filenames: string[]) => {
  const storageRef = getFirebase().storage().ref().child(userId)
  filenames.forEach(async (filename) => {
    const text = await downloadTextFromUrl(
      await storageRef.child(filename).getDownloadURL(),
    )
    downloadFile(filename, text)
  })
}
