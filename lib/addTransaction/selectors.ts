import { createSelector } from 'reselect'

import { State } from '../state'

export const tagsSel = (state: State) => state.tags

export const automaticTagIdsSel = createSelector(tagsSel, (tags) =>
  Object.values(tags)
    .filter((tag) => tag.automatic)
    .map((tag) => tag.id),
)
