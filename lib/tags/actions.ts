import { removeFromFirebase } from '../actions'
import { Thunk } from '../redux/types'
import { createErrorNotification, createSuccessNotification, setSnackbarNotification } from '../shared/actions'

import { transactionsWithTag } from './selectors'

export const removeTag =
  (tagId: string): Thunk =>
  async (dispatch, getState, { logger }) => {
    logger.log('Remove tag', { tagId })

    const txsWithTag = transactionsWithTag(tagId)(getState())
    if (txsWithTag.length !== 0) {
      dispatch(
        setSnackbarNotification(
          createErrorNotification('Unable to remove the tag, because it is used in some transactions')
        )
      )
    } else {
      await dispatch(removeFromFirebase([], [tagId]))
      dispatch(setSnackbarNotification(createSuccessNotification('Tag successfully removed')))
    }
  }
