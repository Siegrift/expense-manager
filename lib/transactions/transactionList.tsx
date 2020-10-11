import React from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { Transaction as TransactionType } from '../addTransaction/state'
import { useIsBigDevice } from '../shared/hooks'

import Transaction from './transaction'

type Props = {
  transactions: TransactionType[]
}

const useStyles = makeStyles((theme: Theme) => ({
  noTransactionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  noTransactions: { textAlign: 'center' },
  searchBar: { marginBottom: theme.spacing(2) },
}))

const TransactionList = ({ transactions }: Props) => {
  const classes = useStyles()
  const bigDevice = useIsBigDevice()

  return (
    <>
      {transactions.length === 0 ? (
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
                itemSize={bigDevice ? 70 : 100}
                itemCount={transactions.length}
              >
                {Transaction}
              </FixedSizeList>
            )
          }}
        </AutoSizer>
      )}
    </>
  )
}

export default TransactionList
