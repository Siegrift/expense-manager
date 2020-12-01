import React from 'react'

import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MuiLink from '@material-ui/core/Link'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Theme, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LaunchIcon from '@material-ui/icons/Launch'
import { DateTimePicker } from '@material-ui/pickers'
import classnames from 'classnames'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'

import ChartWrapper from '../charts/chartWrapper'
import RecentBalance from '../charts/recentBalance'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import { OverviewPeriod } from '../state'
import TransactionList from '../transactions/transactionList'

import { setOverviewPeriod } from './actions'
import {
  overviewPeriodSel,
  overviewTransactionsSel,
  dateRangeSel,
  txsInfoSel,
} from './selectors'

type OverviewLabels = { [k in OverviewPeriod]: string }
const overviewLabels: OverviewLabels = {
  week: 'Week (last 7 days)',
  wtd: 'Week to date',
  month: 'Month (last 30 days)',
  mtd: 'Month to date',
}

const useStyles = makeStyles((theme: Theme) => ({
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  marginBottom: { marginBottom: theme.spacing(1) },
  relativeBalancePos: { fontWeight: 'bold', color: 'green' },
  relativeBalanceNeg: { fontWeight: 'bold', color: 'red' },
  chartWrapper: {
    ['@media (max-height:500px)']: {
      height: '200px !important',
    },
    height: '250px !important',
  },
  link: {
    fontStyle: 'italic',
    display: 'inline-block',
    cursor: 'pointer',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  periodSelectWrapper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexWrap: 'wrap',
  },
}))

const Overview = () => {
  const classes = useStyles()

  const txs = useSelector(overviewTransactionsSel)
  const period = useSelector(overviewPeriodSel)
  const txsInfo = useSelector(txsInfoSel)
  const dispatch = useDispatch()
  const dateRange = useSelector(dateRangeSel)

  return (
    <PageWrapper>
      <Paper style={{ marginBottom: 16, display: 'flex' }}>
        <div className={classes.periodSelectWrapper}>
          <FormControl style={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Overview period</InputLabel>
            <Select
              value={period}
              renderValue={(val) => overviewLabels[val as OverviewPeriod]}
              onChange={(e) =>
                dispatch(setOverviewPeriod(e.target.value as OverviewPeriod))
              }
            >
              {Object.keys(overviewLabels).map((label) => (
                <MenuItem key={label} value={label}>
                  {overviewLabels[label]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DateTimePicker
            ampm={false}
            disableFuture
            disabled
            value={dateRange.start}
            onChange={() => console.log('change start date')}
            label="Start date"
            renderInput={(props) => (
              <TextField {...props} style={{ flex: 1, minWidth: 180 }} />
            )}
          />
          <DateTimePicker
            ampm={false}
            disableFuture
            disabled
            value={dateRange.end}
            onChange={() => console.log('change end date')}
            label="End date"
            renderInput={(props) => (
              <TextField {...props} style={{ flex: 1, minWidth: 180 }} />
            )}
          />
        </div>
      </Paper>

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
            <RecentBalance
              width={width}
              height={height}
              dateRange={dateRange}
            />
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
            Statistics
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography>Income</Typography>
          <Typography>{txsInfo?.income}</Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography>Expense</Typography>
          <Typography>{txsInfo?.expense}</Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography>Number of transactions</Typography>
          <Typography>{txsInfo?.totalTransactions}</Typography>
        </div>

        <Divider />

        <div className={classes.infoRow}>
          <Typography>Relative balance</Typography>
          <Typography
            className={
              txsInfo?.relativeBalance.startsWith('-')
                ? classes.relativeBalanceNeg
                : classes.relativeBalancePos
            }
          >
            {txsInfo?.relativeBalance}
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography>Avarage per day</Typography>
          <Typography
            className={
              txsInfo?.averagePerDay.startsWith('-')
                ? classes.relativeBalanceNeg
                : classes.relativeBalancePos
            }
          >
            {txsInfo?.averagePerDay}
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
          {/* TODO: implement keyboard events and delete transaction handling */}
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
