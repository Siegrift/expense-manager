import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import classnames from 'classnames'
import { difference } from 'lodash'
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
  // TODO: currently there is no way to create a tag with autocomplete
  // https://github.com/mui-org/material-ui/issues/19199
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
        onChange={(_, values: Tag[]) => {
          if (currentTagIds.length < values.length) {
            onSelectTag(values[values.length - 1].id)
          } else {
            const removed = difference(
              currentTagIds,
              values.map((v) => v.id),
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
