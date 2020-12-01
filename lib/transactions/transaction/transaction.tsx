import React from 'react'

import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import NoteIcon from '@material-ui/icons/Comment'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import classnames from 'classnames'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Transaction as TransactionState } from '../../addTransaction/state'
import { DEFAULT_DATE_TIME_FORMAT } from '../../shared/constants'
import { useIsBigDevice } from '../../shared/hooks'
import { formatMoney } from '../../shared/utils'
import { State } from '../../state'
import { setConfirmTxDeleteDialogOpen } from '../actions'
import { cursorSel } from '../selectors'

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    flexDirection: 'column',
    alignItems: 'start',
  },
  chipField: {
    overflow: 'auto',
    display: 'flex',
    width: '100%',
    margin: 'auto',
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
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    justifyContent: 'space-between',
  },
  listItemSecondRow: { display: 'flex', width: '100%', flexDirection: 'row' },
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
  amountWrapper: { margin: `auto ${theme.spacing(4)}px auto 0` },
  dateTimeWrapper: { margin: 'auto' },
}))

type TransactionContentProps = { tx: TransactionState; bigDevice: boolean }

const _TransactionContent = ({ tx, bigDevice }: TransactionContentProps) => {
  const tags = useSelector((state: State) => state.tags)
  const dispatch = useDispatch()
  const classes = useStyles()

  const Amount = (
    <div className={classes.amountWrapper}>
      <Typography
        variant="h4"
        style={{
          color: tx.isExpense ? 'red' : 'green',
          textAlign: 'left',
        }}
      >
        {`${tx.isExpense ? '-' : '+'}${formatMoney(tx.amount, tx.currency)}`}
      </Typography>
    </div>
  )
  const DateComponent = (
    <Tooltip title={format(tx.dateTime, DEFAULT_DATE_TIME_FORMAT)}>
      <Typography
        variant="body1"
        style={{ alignSelf: 'flex-end', margin: 'auto 8px' }}
      >
        {`${formatDistance(tx.dateTime, new Date(), {
          includeSeconds: false,
        })} ago`}
      </Typography>
    </Tooltip>
  )

  const Tags = (
    <div className={classes.chipField}>
      {tx.tagIds.map((id) => {
        return (
          <Chip
            key={id}
            label={tags[id].name}
            onDelete={null as any}
            style={{ margin: 2 }}
          />
        )
      })}
    </div>
  )

  const Icons = (
    <div className={classes.iconPanel}>
      {tx.repeating !== 'none' && (
        <Tooltip title={`Repeating - ${tx.repeating}`}>
          <RepeatOneIcon
            className={classes.icon}
            color={tx.repeating === 'inactive' ? 'disabled' : 'primary'}
          />
        </Tooltip>
      )}
      {tx.note !== '' && (
        <Tooltip title={tx.note}>
          <NoteIcon className={classes.icon} color="primary" />
        </Tooltip>
      )}
      {(tx.attachedFiles?.length ?? 0) > 0 && (
        <Tooltip title="Attached files">
          <AttachFileIcon className={classes.icon} color="primary" />
        </Tooltip>
      )}
      {bigDevice && (
        <>
          <Divider orientation="vertical" flexItem style={{ width: 2 }} />
          <Link href={`/transactions/details?id=${tx.id}`}>
            <Tooltip title="(E)dit transaction">
              <IconButton className={classes.iconButton} data-cy="edit-icon">
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Link>

          <Tooltip title="(D)elete transaction">
            <IconButton
              className={classes.iconButton}
              onClick={(e) => {
                e.stopPropagation()

                dispatch(setConfirmTxDeleteDialogOpen(tx.id))
              }}
            >
              <DeleteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  )

  if (bigDevice) {
    return (
      <>
        <div className={classes.listItemFirstRow}>
          {Amount}
          {Tags}
          {DateComponent}
          {Icons}
        </div>
        <Divider className={classes.divider} />
      </>
    )
  } else {
    return (
      <>
        <div className={classes.listItemFirstRow}>
          {Amount}
          {DateComponent}
        </div>
        <div className={classes.listItemSecondRow}>
          {Tags}
          {Icons}
        </div>
        <Divider className={classes.divider} />
      </>
    )
  }
}

export const TransactionContent = React.memo(_TransactionContent)

const Transaction: React.FC<ListChildComponentProps> = ({
  index,
  style,
  data /* passed as itemData from react-window list (https://react-window.now.sh/#/api/FixedSizeList) */,
}) => {
  const classes = useStyles()
  const tx: TransactionState = data[index]
  const bigDevice = useIsBigDevice()
  const cursor = useSelector(cursorSel)
  const router = useRouter()

  if (bigDevice) {
    return (
      <ListItem
        style={style as any}
        className={classnames(
          classes.listItem,
          index === cursor && classes.cursor,
        )}
        onClick={() =>
          router.replace(`/transactions`, `/transactions#${tx.id}`)
        }
        ContainerComponent="div"
        data-cy="transaction"
      >
        <TransactionContent tx={tx} bigDevice={bigDevice} />
      </ListItem>
    )
  } else {
    return (
      <Link href={`/transactions/details?id=${tx.id}`}>
        <ListItem
          style={style as any}
          className={classes.listItem}
          button
          ContainerComponent="div"
          data-cy="transaction"
        >
          <TransactionContent tx={tx} bigDevice={bigDevice} />
        </ListItem>
      </Link>
    )
  }
}

export default React.memo(Transaction)
