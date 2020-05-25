import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'
import { omit } from '@siegrift/tsfunct'
import classnames from 'classnames'
import difference from 'lodash/difference'
import { v4 as uuid } from 'uuid'

import { Tag } from '../addTransaction/state'
import { getCurrentUserId } from '../firebase/util'
import { ObjectOf } from '../types'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
})

interface TagFieldTag extends Tag {
  createdByTagField?: true
}

export interface TagFieldProps {
  tags: ObjectOf<Tag>
  className?: string
  inputValue: string
  currentTagIds: string[]
  onSelectTag: (tagId: string) => void
  onCreateTag: (tag: Tag) => void
  onSetTagInputValue: (tagName: string) => void
  onRemoveTags: (tagIds: string[]) => void
}

const filterOptions = createFilterOptions<TagFieldTag>()
const ADD_NEW_OPTION_LABEL = 'Create new: '

const TagField = ({
  tags,
  className,
  inputValue,
  currentTagIds,
  onSelectTag,
  onCreateTag,
  onSetTagInputValue,
  onRemoveTags,
}: TagFieldProps) => {
  const classes = useStyles()

  return (
    <div
      className={classnames(classes.root, className)}
      data-cy="tag-field-wrapper"
    >
      <Autocomplete<TagFieldTag, true, true, true>
        multiple
        size="small"
        autoComplete
        freeSolo
        clearOnEscape
        autoHighlight
        options={Object.values(tags)}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="outlined"
              label="Transaction tags"
              fullWidth
            />
          )
        }}
        filterOptions={(options, params) => {
          const filtered = filterOptions(options, params)
          if (
            !filtered.find(
              (option) => params.getOptionLabel(option) === params.inputValue,
            )
          ) {
            const id = uuid()
            filtered.push({
              name: `${ADD_NEW_OPTION_LABEL}${params.inputValue}`,
              automatic: false,
              id,
              // TODO: firebase might not be loaded yet
              uid: getCurrentUserId(),
              createdByTagField: true,
            })
          }
          return filtered
        }}
        includeInputInList
        filterSelectedOptions={false}
        onChange={(_, values) => {
          if (currentTagIds.length < values.length) {
            const added = values[values.length - 1]
            if (typeof added === 'string')
              throw new Error('This should not happen!')
            if (added.createdByTagField) {
              onCreateTag({
                ...omit(added, ['createdByTagField']),
                name: added.name.split(ADD_NEW_OPTION_LABEL)[1],
              })
            } else {
              onSelectTag(added.id)
            }
          } else {
            const removed = difference(
              currentTagIds,
              values.map((v) => (v as Tag).id),
            )
            if (removed.length) onRemoveTags(removed)
          }
        }}
        onInputChange={(event, value) => {
          // NOTE: for some reason this callback fires with null event and resets input value
          if (event != null) onSetTagInputValue(value)
        }}
        inputValue={inputValue}
        value={currentTagIds.map((t) => tags[t])}
      />
    </div>
  )
}

export default TagField
