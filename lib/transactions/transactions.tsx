import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { setCurrentScreen } from '../actions'
import Navigation from '../components/navigation'
import Paper from '../components/paper'
import WithSignedUser from '../components/withSignedUser'
import { State } from '../state'

import Transaction from './transaction'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
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

  return (
    <WithSignedUser>
      <div className={classes.wrapper}>
        <Paper listContainer>
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
    </WithSignedUser>
  )
}

export default Transactions
