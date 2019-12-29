import React from 'react'
import { ComponentProps } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { Tag } from '../addTransaction/state'
import { ObjectOf } from '../types'

const animatedComponents = makeAnimated()

interface InternalSelectTag {
  value: string
  label: string
  tagId: string
}

const convertTagToReactSelectTag = (tag: Tag): InternalSelectTag => ({
  value: tag.name,
  label: tag.name,
  tagId: tag.id,
})

const convertReactSelectTagToTag = (
  allTags: ObjectOf<Tag>,
  tag: InternalSelectTag,
): Tag => allTags[tag.tagId]

export interface TagFieldProps {
  placeholder: string
  availableTags: ObjectOf<Tag>
  newTags: ObjectOf<Tag>
  className?: string
  inputValue: string
  currentTagIds: string[]
  onSelectExistingTag: (tagId: string) => void
  onCreateTag: (tagName: string) => void
  onClearInputValue: () => void
  onSetTagInputValue: (tagName: string) => void
  onChangeTags: (tags: Tag[]) => void
  other?: Partial<ComponentProps<typeof Select>>
}

const TagField = ({
  placeholder,
  newTags,
  availableTags,
  className,
  inputValue,
  currentTagIds,
  onSelectExistingTag,
  onCreateTag,
  onClearInputValue,
  onSetTagInputValue,
  onChangeTags,
  other,
}: TagFieldProps) => {
  const availableTagsArr = Object.values(availableTags)
  const allTags = { ...availableTags, ...newTags }

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      placeholder={placeholder}
      isMulti
      options={availableTagsArr.map((t) => convertTagToReactSelectTag(t))}
      className={className}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'Enter':
          case 'Tab':
            const found = availableTagsArr.find(
              (tag) => tag.name === inputValue,
            )
            if (found) {
              onSelectExistingTag(found.id)
            } else {
              onCreateTag(inputValue)
            }
            onClearInputValue()
            e.preventDefault()
        }
      }}
      onChange={(changedTags: any) =>
        onChangeTags(
          changedTags === null
            ? []
            : (changedTags as InternalSelectTag[]).map((t) =>
                convertReactSelectTagToTag(allTags, t),
              ),
        )
      }
      onInputChange={(newValue) => onSetTagInputValue(newValue)}
      inputValue={inputValue}
      value={currentTagIds.map((id) => convertTagToReactSelectTag(allTags[id]))}
      {...other}
    />
  )
}

export default TagField
