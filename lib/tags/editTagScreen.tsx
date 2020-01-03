import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { removeFromFirebase, uploadToFirebase } from '../actions'
import { tagByIdSel } from './selectors'
import TagDetails from './tagDetails'

const EditTagScreen = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const reduxTag = useSelector(tagByIdSel(router.query.id as string))
  if (!reduxTag) throw new Error('Unknown tag id')
  else {
    return (
      <TagDetails
        appBarTitle="Tag details"
        tag={reduxTag}
        onSave={(tag) => dispatch(uploadToFirebase([], [tag]))}
        onRemove={() => dispatch(removeFromFirebase([], [reduxTag.id]))}
      />
    )
  }
}

export default EditTagScreen
