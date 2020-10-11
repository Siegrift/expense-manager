import React from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import ConfirmDialog from '../components/confirmDialog'
import PageWrapper from '../components/pageWrapper'
import Paper from '../components/paper'
import SearchBar from '../components/searchBar'
import { COMMANDS } from '../search/transactionSearch'
import { BACKGROUND_COLOR } from '../shared/constants'
import { useKeyDownAction } from '../shared/hooks'

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
import { TransactionContent } from './transaction'
import TransactionList from './transactionList'

const useStyles = makeStyles((theme: Theme) => ({
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

  useKeyDownAction((e: KeyboardEvent) => {
    if (document.activeElement?.tagName !== 'INPUT') {
      dispatch(keyPressAction(e))
    }
  })

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
        <TransactionList transactions={transactions} />
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
