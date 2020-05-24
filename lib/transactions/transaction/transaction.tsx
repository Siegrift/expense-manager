import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import formatDistance from 'date-fns/formatDistance'
import NoteIcon from '@material-ui/icons/Comment'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'

import { formatMoney } from '../../shared/utils'
import { State } from '../../state'
import { applySearchOnTransactions, cursorSel } from '../selectors'
import { useIsBigDevice } from '../../shared/hooks'
import { Transaction as TransactionState } from '../../addTransaction/state'
import IconButton from '@material-ui/core/IconButton'
import { removeTx, setCursor } from '../actions'
import classnames from 'classnames'

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    flexDirection: 'column',
    alignItems: 'start',
  },
  chipField: {
    overflow: 'auto',
    display: 'flex',
    width: '100%',
  },
  divider: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: -theme.spacing(1),
  },
  listItemFirstRow: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  iconPanel: {
    alignSelf: 'center',
    display: 'flex',
  },
  icon: {
    margin: '4px 6px',
  },
  iconButton: {
    padding: theme.spacing(1) / 2,
  },
  cursor: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}))

type TransactionContentProps = { tx: TransactionState; bigDevice: boolean }

const TransactionContent = ({ tx, bigDevice }: TransactionContentProps) => {
  const tags = useSelector((state: State) => state.tags)
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <>
      <div className={classes.listItemFirstRow}>
        <ListItemText
          primary={
            <Typography
              variant="h4"
              style={{ color: tx.isExpense ? 'red' : 'green' }}
            >
              {`${tx.isExpense ? '-' : '+'}${formatMoney(
                tx.amount,
                tx.currency,
              )}`}
            </Typography>
          }
        />
        <div style={{ margin: 'auto' }}>
          <Typography variant="body1" style={{ alignSelf: 'flex-end' }}>
            {`${formatDistance(tx.dateTime, new Date(), {
              includeSeconds: true,
            })} ago`}
          </Typography>
        </div>
      </div>

      <div style={{ display: 'flex', width: '100%' }}>
        <div className={classes.chipField}>
          {tx.tagIds.map((id) => {
            return (
              <Chip key={id} label={tags[id].name} onDelete={null as any} />
            )
          })}
        </div>
        <div className={classes.iconPanel}>
          {tx.repeating !== 'none' && (
            <Tooltip title="Repeating transaction">
              <RepeatOneIcon
                className={classes.icon}
                color={tx.repeating === 'inactive' ? 'disabled' : 'primary'}
              />
            </Tooltip>
          )}
          {tx.note !== '' && (
            <Tooltip title="Contains note">
              <NoteIcon className={classes.icon} color="primary" />
            </Tooltip>
          )}

          {bigDevice && (
            <>
              <Divider orientation="vertical" flexItem style={{ width: 2 }} />
              <Tooltip title="(E)dit transaction">
                <Link href={`/transactions/${tx.id}`}>
                  <IconButton className={classes.iconButton}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="(D)elete transaction">
                <IconButton
                  className={classes.iconButton}
                  // TODO: confirm dialog
                  onClick={() => dispatch(removeTx(tx.id))}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      <Divider className={classes.divider} />
    </>
  )
}

const Transaction: React.FC<ListChildComponentProps> = ({ index, style }) => {
  const classes = useStyles()
  const transactions = useSelector(applySearchOnTransactions)
  const tx = transactions[index]
  const bigDevice = useIsBigDevice()
  const cursor = useSelector(cursorSel)
  const dispatch = useDispatch()

  if (bigDevice) {
    return (
      <ListItem
        style={style}
        className={classnames(
          classes.listItem,
          index === cursor && classes.cursor,
        )}
        onClick={() => dispatch(setCursor(index))}
      >
        <TransactionContent tx={tx} bigDevice={bigDevice} />
      </ListItem>
    )
  } else {
    return (
      <Link href={`/transactions/${tx.id}`}>
        <ListItem style={style} className={classes.listItem} button>
          <TransactionContent tx={tx} bigDevice={bigDevice} />
        </ListItem>
      </Link>
    )
  }
}

export default Transaction
