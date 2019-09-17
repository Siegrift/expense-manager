import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import { setCurrentScreen } from '../lib/actions'
// import { Transaction } from '../lib/addTransaction/state'
import { useRedirectIfNotSignedIn } from '../lib/shared/hooks'
import { LoadingScreen } from '../lib/shared/Loading'
import Navigation from '../lib/shared/Navigation'
import { State } from '../lib/state'

// const tx: Transaction = {
//   amount: '13.4',
//   currency: 'EUR',
//   dateTime: new Date(),
//   id: 'cfc4b337-9032-4cd1-8880-f484bd3f2fc8',
//   isExpense: true,
//   note: 'note',
//   tagIds: ['tag1', 'tag2', 'tag3'],
//   transactionType: 'fromUser',
// }

const TransactionRow = (props: ListChildComponentProps) => {
  const { index, style } = props

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  )
}

// {Object.values(transactions).map((tx) => JSON.stringify(tx))}

const Transactions = () => {
  const transactions = useSelector((state: State) => state.transactions)
  const dispatch = useDispatch()

  dispatch(setCurrentScreen('transactions'))

  if (useRedirectIfNotSignedIn() !== 'loggedIn') {
    return <LoadingScreen />
  } else {
    return (
      <>
        <AutoSizer>
          {({ height, width }) => {
            console.log(height, width)
            return (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={4600}
                itemCount={Object.keys(transactions).length}
              >
                {TransactionRow}
              </FixedSizeList>
            )
          }}
        </AutoSizer>
        <Navigation />
      </>
    )
  }
}

export default Transactions
