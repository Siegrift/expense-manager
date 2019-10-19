import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { setCurrentScreen } from '../actions'
import { LoadingScreen } from '../components/loading'
import Navigation from '../components/navigation'
import { useRedirectIfNotSignedIn } from '../shared/hooks'
import { State } from '../state'

import Transaction from './transaction'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    width: '100vw',
  },
  paper: {
    height: `calc(100% - ${theme.spacing(2 * 2)}px)`,
    margin: theme.spacing(2),
  },
  noTransactionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  noTransactions: { textAlign: 'center' },
}))

const Transactions = () => {
  const transactions = useSelector((state: State) => state.transactions)
  const dispatch = useDispatch()
  const classes = useStyles()

  dispatch(setCurrentScreen('transactions'))

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          {Object.keys(transactions).length === 0 ? (
            <div className={classes.noTransactionsWrapper}>
              <Typography
                variant="overline"
                display="block"
                gutterBottom
                className={classes.noTransactions}
              >
                You have no transactions...
              </Typography>
            </div>
          ) : (
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={100}
                    itemCount={Object.keys(transactions).length}
                  >
                    {Transaction}
                  </FixedSizeList>
                )
              }}
            </AutoSizer>
          )}
        </Paper>
        <Navigation />
      </div>
    )
  }
}

export default Transactions
