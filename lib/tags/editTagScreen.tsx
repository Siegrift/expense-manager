import { useRouter } from 'next/router'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeFromFirebase, uploadToFirebase } from '../actions'
import { Tag } from '../addTransaction/state'
import {
  isRecurringTagSel,
  latestTransactionWithTagSel,
  tagByIdSel,
  totalExpenseInTransactionsSel,
  totalTransactionsSel,
} from './selectors'
import TagDetails from './tagDetails'

interface WithValidTagIdProps {
  children: (reduxTag: Tag) => JSX.Element
}

const WithValidTagId: React.FC<WithValidTagIdProps> = (props) => {
  const router = useRouter()
  const reduxTag = useSelector(tagByIdSel(router.query.id as string))

  if (reduxTag) return props.children!(reduxTag)
  else return null
}

interface EditTagScreenContentProps {
  tag: Tag
}

const EditTagScreenContent = ({ tag }: EditTagScreenContentProps) => {
  const dispatch = useDispatch()
  const totalTxs = useSelector(totalTransactionsSel(tag.id))
  const moneyInvolvedInTxs = useSelector(totalExpenseInTransactionsSel(tag.id))
  const latestTransaction = useSelector(latestTransactionWithTagSel(tag.id))
  const isRecurring = useSelector(isRecurringTagSel(tag.id))

  return (
    <TagDetails
      appBarTitle="Tag details"
      tag={tag}
      stats={{
        totalTxs,
        moneyInvolvedInTxs,
        latestTransaction,
        isRecurring,
      }}
      onSave={(modifiedTag) => dispatch(uploadToFirebase([], [modifiedTag]))}
      onRemove={() => dispatch(removeFromFirebase([], [tag.id]))}
    />
  )
}

const EditTagScreen = () => {
  return (
    <WithValidTagId>
      {(reduxTag) => <EditTagScreenContent tag={reduxTag} />}
    </WithValidTagId>
  )
}

export default EditTagScreen
