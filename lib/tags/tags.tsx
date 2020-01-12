import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import Router from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { setCurrentScreen } from '../actions'
import Navigation from '../components/navigation'
import Paper from '../components/paper'
import WithSignedUser from '../components/withSignedUser'

import { tagsSel } from './selectors'
import TagItem from './tagItem'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
  },
  noTagsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  noTransactions: { textAlign: 'center' },
  createTag: {
    margin: theme.spacing(2),
    marginTop: 0,
  },
}))

const Transactions = () => {
  const tagsLength = Object.values(useSelector(tagsSel)).length
  const dispatch = useDispatch()
  const classes = useStyles()

  dispatch(setCurrentScreen('tags'))

  return (
    <WithSignedUser>
      <div className={classes.wrapper}>
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

        <Button
          variant="contained"
          color="primary"
          aria-label="create tag"
          className={classes.createTag}
          onClick={() => Router.push('/tags/create')}
          startIcon={<AddIcon />}
        >
          Create new tag
        </Button>
        <Navigation />
      </div>
    </WithSignedUser>
  )
}

export default Transactions
