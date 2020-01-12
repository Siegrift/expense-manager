import React from 'react'
import { useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import { uploadToFirebase } from '../actions'
import { getCurrentUserId } from '../firebase/util'
import withSignedUser from '../hoc/withSignedUser'
import TagDetails from './tagDetails'

const CreateTagScreen = () => {
  const dispatch = useDispatch()

  return (
    <TagDetails
      appBarTitle="Create new tag"
      tag={{
        uid: getCurrentUserId(),
        id: uuid(),
        automatic: false,
        name: '',
      }}
      onSave={(tag) => dispatch(uploadToFirebase([], [tag]))}
    />
  )
}

export default withSignedUser(CreateTagScreen)
