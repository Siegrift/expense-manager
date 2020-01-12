import React from 'react'
import { useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import { uploadToFirebase } from '../actions'
import WithSignedUser from '../components/withSignedUser'
import { getCurrentUserId } from '../firebase/util'
import TagDetails from './tagDetails'

const CreateTagScreen = () => {
  const dispatch = useDispatch()

  return (
    <WithSignedUser>
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
    </WithSignedUser>
  )
}

export default CreateTagScreen
