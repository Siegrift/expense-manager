import React from 'react'

import MuiLink from '@material-ui/core/Link'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LaunchIcon from '@material-ui/icons/Launch'
import classnames from 'classnames'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import ChartWrapper from '../charts/chartWrapper'
import RecentBalance from '../charts/recentBalance'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import TransactionList from '../transactions/transactionList'

import { overviewTransactionsSel, txsInfoSel } from './selectors'

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  marginBottom: { marginBottom: theme.spacing(1) },
  relativeBalance: { fontWeight: 'bold', color: 'red' },
  chartWrapper: {
    ['@media (max-height:500px)']: {
      height: '200px !important',
    },
    height: '250px !important',
  },
  link: { fontStyle: 'italic', display: 'inline-block', cursor: 'pointer' },
}))

const Overview = () => {
  const classes = useStyles()

  const txs = useSelector(overviewTransactionsSel)
  const txsInfo = useSelector(txsInfoSel)

  return (
    <PageWrapper>
      <Paper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 24,
            marginBottom: -15,
          }}
        >
          <Typography variant="overline" style={{ textAlign: 'center' }}>
            Relative balance
          </Typography>
        </div>

        <ChartWrapper
          className={classes.chartWrapper}
          Container="div"
          renderChart={({ width, height }) => (
            <RecentBalance width={width} height={height} hideToggles />
          )}
        />
        <Link href={`/charts`}>
          <MuiLink
            className={classnames(classes.marginBottom, classes.link)}
            variant="body2"
            underline="always"
          >
            <>
              See all charts{' '}
              <LaunchIcon style={{ marginBottom: -2 }} fontSize="inherit" />
            </>
          </MuiLink>
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 24,
          }}
        >
          <Typography variant="overline" style={{ textAlign: 'center' }}>
            Last 7 days stats
          </Typography>
        </div>
        <div className={classes.row}>
          <Typography>Income</Typography>
          <Typography>{txsInfo?.income}</Typography>
        </div>
        <div className={classes.row}>
          <Typography>Expense</Typography>
          <Typography>{txsInfo?.expense}</Typography>
        </div>
        <div className={classes.row}>
          <Typography>Relative balance</Typography>
          <Typography className={classes.relativeBalance}>
            {txsInfo?.relativeBalance}
          </Typography>
        </div>
        <div className={classes.row}>
          <Typography>Avarage per day</Typography>
          <Typography className={classes.relativeBalance}>
            {txsInfo?.average}
          </Typography>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 24,
          }}
        >
          <Typography variant="overline" style={{ textAlign: 'center' }}>
            Transactions
          </Typography>
        </div>
        <div style={{ height: 250 }}>
          {/* TODO: implement keyboard events */}
          <TransactionList transactions={txs} />
        </div>
        <Link href={`/transactions`}>
          <MuiLink
            className={classnames(classes.marginBottom, classes.link)}
            variant="body2"
            underline="always"
          >
            <>
              See all transactions{' '}
              <LaunchIcon style={{ marginBottom: -2 }} fontSize="inherit" />
            </>
          </MuiLink>
        </Link>
      </Paper>
    </PageWrapper>
  )
}

export default Overview
