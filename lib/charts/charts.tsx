import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

import Navigation from '../components/navigation'
import withSignedUser from '../hoc/withSignedUser'

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
  const classes = useStyles()

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

export default withSignedUser(Charts)
