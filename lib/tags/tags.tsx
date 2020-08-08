import React from 'react'

import Button from '@material-ui/core/Button'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'

import { tagsSel } from './selectors'
import TagItem from './tagItem'

const useStyles = makeStyles((theme: Theme) => ({
  noTagsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  noTransactions: { textAlign: 'center' },
  createTag: {
    marginTop: theme.spacing(2),
  },
}))

const Transactions = () => {
  const tagsLength = Object.values(useSelector(tagsSel)).length
  const classes = useStyles()

  return (
    <PageWrapper>
      <Paper listContainer>
        {tagsLength === 0 ? (
          <div className={classes.noTagsWrapper}>
            <Typography
              variant="overline"
              display="block"
              gutterBottom
              className={classes.noTransactions}
            >
              You have no tags...
            </Typography>
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => {
              return (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemSize={60}
                  itemCount={tagsLength}
                >
                  {TagItem}
                </FixedSizeList>
              )
            }}
          </AutoSizer>
        )}
      </Paper>

      <Link href="/tags/create">
        <Button
          variant="contained"
          color="primary"
          aria-label="create tag"
          className={classes.createTag}
          startIcon={<AddIcon />}
        >
          Create new tag
        </Button>
      </Link>
    </PageWrapper>
  )
}

export default Transactions
