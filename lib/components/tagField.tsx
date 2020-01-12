import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import classnames from 'classnames'
import difference from 'lodash/difference'
import React from 'react'
import { Tag } from '../addTransaction/state'
import { ObjectOf } from '../types'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
}))

export interface TagFieldProps {
  tags: ObjectOf<Tag>
  className?: string
  inputValue: string
  currentTagIds: string[]
  onSelectTag: (tagId: string) => void
  // TODO: currently there is no way to issue a label for creating a new tag, but it's
  // being discussed in https://github.com/mui-org/material-ui/issues/18985
  onCreateTag: (tagName: string) => void
  onSetTagInputValue: (tagName: string) => void
  onRemoveTags: (tagIds: string[]) => void
}

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
    <div className={classnames(classes.root, className)}>
      <Autocomplete
        multiple
        size="small"
        autoComplete
        freeSolo
        clearOnEscape
        autoHighlight
        options={Object.values(tags)}
        getOptionLabel={(option: Tag) => option.name}
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
        includeInputInList
        filterSelectedOptions={false}
        // if a new tag is created it will be appended as a string to the end of the array
        onChange={(_, values: Array<Tag | string>) => {
          if (currentTagIds.length < values.length) {
            const added = values[values.length - 1]
            if (typeof added === 'string') {
              onCreateTag(added)
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
          // TODO: for some reason this callback fires with null event and resets input value
          if (event != null) onSetTagInputValue(value)
        }}
        inputValue={inputValue}
        value={currentTagIds.map((t) => tags[t])}
      />
    </div>
  )
}

export default TagField
