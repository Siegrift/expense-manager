import React from 'react'
import { useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import { uploadToFirebase } from '../actions'
import { LoadingScreen } from '../components/loading'
import { getCurrentUserId } from '../firebase/util'
import { useRedirectIfNotSignedIn } from '../shared/hooks'
import TagDetails from './tagDetails'

const CreateTagScreen = () => {
  const dispatch = useDispatch()

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    const initialTag = {
      uid: getCurrentUserId(),
      id: uuid(),
      automatic: false,
      name: '',
    }

    return (
      <TagDetails
        appBarTitle="Create new tag"
        tag={initialTag}
        onSave={(tag) => dispatch(uploadToFirebase([], [tag]))}
      />
    )
  }
}

export default CreateTagScreen
