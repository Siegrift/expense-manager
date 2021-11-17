import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
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
import { DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers'
import classnames from 'classnames'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'

import ChartWrapper from '../charts/chartWrapper'
import RecentBalance from '../charts/recentBalance'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import { setCurrentFilter } from '../filters/actions'
import { availableFiltersSel, currentFilterSel } from '../filters/selectors'
import { DEFAULT_DATE_FORMAT } from '../shared/constants'
import { OverviewPeriod } from '../state'
import TransactionList from '../transactions/transactionList'

import { setOverviewPeriod, setCustomDateRange as setCustomDateRangeAction, setMonth } from './actions'
import {
  overviewPeriodSel,
  overviewTransactionsSel,
  dateRangeSel,
  txsInfoSel,
  overviewMonthsSel,
  monthSel,
} from './selectors'

type OverviewLabels = { [k in OverviewPeriod]: string }
const overviewLabels: OverviewLabels = {
  '7days': 'Last 7 days',
  '30days': 'Last 30 days',
  month: 'Month',
  custom: 'Custom',
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
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexWrap: 'wrap',
  },
}))

const NO_FILTER = 'no filter'

const Overview = () => {
  const classes = useStyles()

  const txs = useSelector(overviewTransactionsSel)
  const period = useSelector(overviewPeriodSel)
  const txsInfo = useSelector(txsInfoSel)
  const dispatch = useDispatch()
  const dateRange = useSelector(dateRangeSel)
  const overviewMonths = useSelector(overviewMonthsSel)
  const month = useSelector(monthSel)
  const currentFilter = useSelector(currentFilterSel)
  const availableFilters = useSelector(availableFiltersSel)

  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [customDateRangeError, setCustomDateRangeError] = useState<[string | null, string | null]>([null, null])

  return (
    <PageWrapper>
      <Paper style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
        <FormControl style={{ flex: 1, minWidth: 200 }}>
          <InputLabel>Active filter</InputLabel>
          <Select
            value={currentFilter?.name ?? NO_FILTER}
            onChange={(e) => {
              const filterName = e.target.value as string
              dispatch(
                setCurrentFilter(
                  filterName === NO_FILTER ? undefined : availableFilters!.find((f) => f.name === filterName)!
                )
              )
            }}
          >
            {availableFilters?.map((filter) => (
              <MenuItem key={filter.name} value={filter.name}>
                {filter.name}
              </MenuItem>
            ))}
            <MenuItem key={NO_FILTER} value={NO_FILTER}>
              No active filter
            </MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: 'flex', marginTop: 16, flexWrap: 'wrap' }}>
          <FormControl style={{ flex: 1, minWidth: 200, marginRight: 8 }}>
            <InputLabel>Overview period</InputLabel>
            <Select
              value={period}
              renderValue={(val) => overviewLabels[val as OverviewPeriod]}
              onChange={(e) => dispatch(setOverviewPeriod(e.target.value as OverviewPeriod))}
            >
              {Object.keys(overviewLabels).map((label) => (
                <MenuItem key={label} value={label}>
                  {overviewLabels[label]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {period === 'month' && (
            <FormControl style={{ flex: 1 }}>
              <InputLabel>Month</InputLabel>
              <Select
                label="Month"
                value={overviewMonths[month]}
                onChange={(e) => dispatch(setMonth(overviewMonths.findIndex((m) => m === e.target.value)))}
                style={{ flex: 1 }}
              >
                {overviewMonths.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {period === 'custom' && (
            <>
              <DateRangePicker
                inputFormat={DEFAULT_DATE_FORMAT}
                disableFuture
                value={customDateRange}
                onChange={(range) => {
                  if (customDateRangeError[0] === null && customDateRangeError[1] === null) setCustomDateRange(range)
                }}
                onError={(reason) => setCustomDateRangeError(reason)}
                startText="Start date"
                endText="End date"
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps} variant="standard" style={{ flex: 1, minWidth: 180 }} />
                    <DateRangeDelimiter> to </DateRangeDelimiter>
                    <TextField {...endProps} variant="standard" style={{ flex: 1, minWidth: 180 }} />
                  </React.Fragment>
                )}
              />
              <Button
                onClick={() => dispatch(setCustomDateRangeAction(customDateRange))}
                color="primary"
                fullWidth
                variant="contained"
                style={{ flex: 1, margin: '24px 8px' }}
              >
                Show
              </Button>
            </>
          )}
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
          renderChart={({ width, height }) => <RecentBalance width={width} height={height} dateRange={dateRange} />}
        />
        <Link href={`/charts`}>
          <MuiLink className={classnames(classes.marginBottom, classes.link)} variant="body2" underline="always">
            <>
              See all charts <LaunchIcon style={{ marginBottom: -2 }} fontSize="inherit" />
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
              txsInfo?.relativeBalance.startsWith('-') ? classes.relativeBalanceNeg : classes.relativeBalancePos
            }
          >
            {txsInfo?.relativeBalance}
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <Typography>Avarage per day</Typography>
          <Typography
            className={txsInfo?.averagePerDay.startsWith('-') ? classes.relativeBalanceNeg : classes.relativeBalancePos}
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
          <MuiLink className={classnames(classes.marginBottom, classes.link)} variant="body2" underline="always">
            <>
              See all transactions <LaunchIcon style={{ marginBottom: -2 }} fontSize="inherit" />
            </>
          </MuiLink>
        </Link>
      </Paper>
    </PageWrapper>
  )
}

export default Overview
