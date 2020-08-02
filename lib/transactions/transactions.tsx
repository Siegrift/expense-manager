import React, { useEffect } from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import SearchBar from '../components/searchBar'
import { COMMANDS } from '../search/transactionSearch'

import { changeTxSearchQuery, keyPressAction } from './actions'
import {
  applySearchOnTransactions,
  isValidQuerySel,
  txSearchQuerySel,
  valueOptionsSel,
} from './selectors'
import Transaction from './transaction'

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

const Transactions = () => {
  const txSearchQuery = useSelector(txSearchQuerySel)
  const transactions = useSelector(applySearchOnTransactions)
  const isValidQuery = useSelector(isValidQuerySel)
  const valueOptions = useSelector(valueOptionsSel)
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'BODY') {
        dispatch(keyPressAction(e))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])

  return (
    <PageWrapper>
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
    </PageWrapper>
  )
}

export default Transactions
