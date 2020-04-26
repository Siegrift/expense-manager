import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import Navigation from '../components/navigation'
import Paper from '../components/paper'
import Transaction from './transaction'
import SearchBar from '../components/searchBar'
import { COMMANDS } from '../search/transactionSearch'

import { changeTxSearchQuery } from './actions'
import {
  applySearchOnTransactions,
  isValidQuerySel,
  txSearchQuerySel,
  valueOptionsSel,
} from './selectors'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    ['@media (max-height:500px)']: {
      height: 'calc(100vh)',
    },
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  noTransactionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  noTransactions: { textAlign: 'center' },
  searchBar: { marginBottom: theme.spacing(2) },
}))

const Transactions = () => {
  const txSearchQuery = useSelector(txSearchQuerySel)
  const transactions = useSelector(applySearchOnTransactions)
  const isValidQuery = useSelector(isValidQuerySel)
  const valueOptions = useSelector(valueOptionsSel)
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <>
      <div className={classes.wrapper}>
        <SearchBar
          className={classes.searchBar}
          commands={COMMANDS.map((c) => c.name)}
          placeholder="Search transactions"
          onQueryChange={(newQuery) => dispatch(changeTxSearchQuery(newQuery))}
          query={txSearchQuery}
          isValidQuery={isValidQuery}
          valueOptions={valueOptions}
        />

        <Paper listContainer>
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
                    itemSize={100}
                    itemCount={transactions.length}
                  >
                    {Transaction}
                  </FixedSizeList>
                )
              }}
            </AutoSizer>
          )}
        </Paper>
      </div>
      <Navigation />
    </>
  )
}

export default Transactions
