import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useDispatch } from 'react-redux'

import { setCurrentScreen } from '../lib/actions'
import AllTransactions from '../lib/components/charts/AllTransactions'
import ChartWrapper from '../lib/components/charts/ChartWrapper'
import RecentBalance from '../lib/components/charts/RecentBalance'
import TagPercentages from '../lib/components/charts/TagPercentages'
import { useRedirectIfNotSignedIn } from '../lib/shared/hooks'
import { LoadingScreen } from '../lib/shared/Loading'
import Navigation from '../lib/shared/Navigation'

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
