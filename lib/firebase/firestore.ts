import { downloadFile, downloadTextFromUrl } from '../shared/utils'

import { getStorageRef } from './firebase'

export const firestoreFileContent = async (userId: string, path: string[]) => {
  return await downloadTextFromUrl(
    await getStorageRef(userId, ...path).getDownloadURL(),
  )
}

export const downloadFiles = (userId: string, paths: string[][]) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  paths.forEach(async (path) => {
    const text = await downloadTextFromUrl(
      await getStorageRef(userId, 'backup', ...path).getDownloadURL(),
    )
    downloadFile(path[path.length - 1], text)
  })
}

export const removeFiles = (userId: string, paths: string[][]) =>
  paths.map((path) => getStorageRef(userId, ...path).delete())
