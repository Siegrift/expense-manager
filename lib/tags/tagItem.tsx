import React from 'react'

import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AutoIcon from '@material-ui/icons/BrightnessAuto'
import EuroIcon from '@material-ui/icons/Euro'
import NotRecentlyUsedIcon from '@material-ui/icons/EventBusy'
import TotalTxsIcon from '@material-ui/icons/PostAddTwoTone'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import {
  isRecentlyUsedSel,
  isRecurringTagSel,
  tagFromSortedTagsByIndex,
  totalExpenseInTransactionsSel,
  totalTransactionsSel,
} from './selectors'

const useStyles = makeStyles({
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
  },
  listItemFirstRow: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  iconPanel: {
    display: 'flex',
    alignSelf: 'center',
  },
  icon: {
    margin: 3,
  },
  txsSum: {
    margin: 3,
    marginRight: 8,
  },
})

const TagItem: React.FC<ListChildComponentProps> = ({ index, style }) => {
  const tag = useSelector(tagFromSortedTagsByIndex(index))
  const totalTxs = useSelector(totalTransactionsSel(tag.id))
  const totalExpenseInTxs = useSelector(totalExpenseInTransactionsSel(tag.id))
  const isRecentlyUsed = useSelector(isRecentlyUsedSel(tag.id))
  const isRecurring = useSelector(isRecurringTagSel(tag.id))
  const classes = useStyles()

  return (
    <Link href={`/tags/details?id=${tag.id}`}>
      <ListItem button style={style as any} className={classes.listItem} ContainerComponent="div">
        <div style={{ display: 'flex', width: '100%' }}>
          <ListItemText
            primary={
              <Typography variant="subtitle1" style={{ lineHeight: '44px' }}>
                {tag.name}
              </Typography>
            }
          />
          <div className={classes.iconPanel}>
            {tag.automatic && (
              <Tooltip title="Automatic tag">
                <AutoIcon className={classes.icon} />
              </Tooltip>
            )}
            {isRecurring && (
              <Tooltip title="In recurring transaction">
                <RepeatOneIcon className={classes.icon} />
              </Tooltip>
            )}
            {!isRecentlyUsed && (
              <Tooltip title="Not recently used">
                <NotRecentlyUsedIcon className={classes.icon} color="secondary" />
              </Tooltip>
            )}
            <Tooltip title="Transaction count">
              <Badge className={classes.icon} badgeContent={totalTxs} max={99} color="primary">
                <TotalTxsIcon />
              </Badge>
            </Tooltip>
            <Tooltip title="Money involved">
              <Badge className={classes.txsSum} badgeContent={totalExpenseInTxs} color="primary" max={999}>
                <EuroIcon />
              </Badge>
            </Tooltip>
          </div>
        </div>
        <Divider className={classes.divider} />
      </ListItem>
    </Link>
  )
}

export default React.memo(TagItem)
