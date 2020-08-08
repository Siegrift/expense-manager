import React, { useEffect } from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import ConfirmDialog from '../components/confirmDialog'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import SearchBar from '../components/searchBar'
import { COMMANDS } from '../search/transactionSearch'
import { BACKGROUND_COLOR } from '../shared/constants'

import {
  changeTxSearchQuery,
  keyPressAction,
  removeTx,
  setConfirmTxDeleteDialogOpen,
} from './actions'
import {
  applySearchOnTransactions,
  isValidQuerySel,
  txSearchQuerySel,
  valueOptionsSel,
  confirmDeleteDialogForTxSel,
} from './selectors'
import Transaction, { TransactionContent } from './transaction'

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
  const confirmDeleteDialogForTx = useSelector(confirmDeleteDialogForTxSel)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName !== 'INPUT') {
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

      {true && (
        <ConfirmDialog
          ContentComponent={
            <>
              <p>Do you really want to remove the following transaction?</p>
              <div
                style={{
                  backgroundColor: BACKGROUND_COLOR,
                }}
              >
                <div
                  style={{
                    transform: 'scale(0.7)',
                    backgroundColor: 'white',
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <TransactionContent
                    tx={confirmDeleteDialogForTx!}
                    bigDevice={true}
                  />
                </div>
              </div>
              <i>
                <b>This action can't be undone!</b>
              </i>
            </>
          }
          open={confirmDeleteDialogForTx !== null}
          onCancel={() => dispatch(setConfirmTxDeleteDialogOpen(false))}
          onConfirm={() => {
            dispatch(removeTx(confirmDeleteDialogForTx!.id))
            dispatch(setConfirmTxDeleteDialogOpen(false))
          }}
        />
      )}
    </PageWrapper>
  )
}

export default Transactions
