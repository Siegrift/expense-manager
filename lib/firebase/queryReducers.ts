import { QueryReducer } from './queries'
import { omit, update } from '@siegrift/tsfunct'

export const lastTenEntries: QueryReducer = (state, payload) => {
  return update(state, ['messages'], (msgs) => {
    let newMess = msgs
    payload.docChanges().forEach((c) => {
      if (c.type == 'removed') {
        newMess = omit(newMess, [c.doc.id])
      } else if (c.type == 'added') {
        newMess = { ...newMess, [c.doc.id]: c.doc.data() }
      } else {
        newMess = update(newMess, [c.doc.id], () => c.doc.data())
      }
    })
    return newMess
  })
}
