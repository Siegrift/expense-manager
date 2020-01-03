import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import Router from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { setCurrentScreen } from '../actions'
import { LoadingScreen } from '../components/loading'
import Navigation from '../components/navigation'
import { useRedirectIfNotSignedIn } from '../shared/hooks'

import { tagsSel } from './selectors'
import TagItem from './tagItem'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    flex: 1,
    margin: theme.spacing(2),
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

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
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
    )
  }
}

export default Transactions
