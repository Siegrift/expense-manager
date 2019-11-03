import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'

import { removeFromFirebase, uploadToFirebase } from '../actions'
import { getCurrentUserId } from '../firebase/util'

import AddOrEditTag from './addOrEditTag'
import { tagByIdSel } from './selectors'

const AddOrEditTagScreen = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const reduxTx = useSelector(tagByIdSel(router.query.id as string))
  if (reduxTx) {
    return (
      <AddOrEditTag
        appBarTitle="Edit tag"
        initialIsAutotag={reduxTx.automatic}
        initialTagName={reduxTx.name}
        returnUrl={'/tags'}
        onSave={(tag) => dispatch(uploadToFirebase([], [{ ...reduxTx, ...tag }]))}
        onRemove={() => dispatch(removeFromFirebase([], [reduxTx.id]))}
      />
    )
  } else {
    return (
      <AddOrEditTag
        appBarTitle="Create tag"
        initialIsAutotag={false}
        initialTagName={''}
        returnUrl={'/tags'}
        onSave={(tag) =>
          dispatch(
            uploadToFirebase(
              [],
              [{ uid: getCurrentUserId(), id: uuid(), ...tag }],
            ),
          )
        }
      />
    )
  }
}

export default AddOrEditTagScreen
