import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useDispatch } from 'react-redux'

import { setCurrentScreen } from '../actions'
import { LoadingScreen } from '../components/loading'
import Navigation from '../components/navigation'
import { useRedirectIfNotSignedIn } from '../shared/hooks'

import AllTransactions from './allTransactions'
import ChartWrapper from './chartWrapper'
import RecentBalance from './recentBalance'
import TagPercentages from './tagPercentages'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: `calc(100vh - 56px)`,
    padding: theme.spacing(2),
    overflow: 'auto',
    overflowX: 'hidden',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  },
}))

const Charts = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  dispatch(setCurrentScreen('charts'))

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    return (
      <>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <ChartWrapper label="Recent balance">
            <RecentBalance />
          </ChartWrapper>

          <ChartWrapper label="All Transactions">
            <AllTransactions />
          </ChartWrapper>

          <ChartWrapper label="Tag percentages">
            <TagPercentages />
          </ChartWrapper>
        </Grid>
        <Navigation />
      </>
    )
  }
}

export default Charts
