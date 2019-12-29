import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import AutoIcon from '@material-ui/icons/BrightnessAuto'
import EuroIcon from '@material-ui/icons/Euro'
import EventBusyIcon from '@material-ui/icons/EventBusy'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import Router from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import {
  isRecentlyUsedTagSel,
  isRecurringTagSel,
  tagFromSortedTagsByIndex,
  totalExpenseInTransactionsSel,
  totalTransactionsSel,
} from './selectors'

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
}))

const TagItem = (props: ListChildComponentProps) => {
  const { index, style } = props
  const tag = useSelector(tagFromSortedTagsByIndex(index))
  const totalTxs = useSelector(totalTransactionsSel(tag.id))
  const totalExpenseInTxs = useSelector(totalExpenseInTransactionsSel(tag.id))
  const isRecentlyUsed = useSelector(isRecentlyUsedTagSel(tag.id))
  const isRecurring = useSelector(isRecurringTagSel(tag.id))
  const classes = useStyles()

  return (
    <ListItem
      button
      style={style}
      className={classes.listItem}
      onClick={() => Router.push('/tags/[id]', `/tags/${tag.id}`)}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <ListItemText
          primary={
            <Typography variant="subtitle1" style={{ lineHeight: '44px' }}>
              {tag.name}
            </Typography>
          }
        />
        <div className={classes.iconPanel}>
          {tag.automatic && <AutoIcon />}
          {isRecurring && <RepeatOneIcon className={classes.icon} />}
          {!isRecentlyUsed && (
            <EventBusyIcon className={classes.icon} color="secondary" />
          )}
          <Badge
            className={classes.icon}
            badgeContent={totalTxs}
            max={99}
            color="primary"
          >
            <AccountBalanceIcon />
          </Badge>
          <Badge
            className={classes.txsSum}
            badgeContent={totalExpenseInTxs}
            color="primary"
            max={999}
          >
            <EuroIcon />
          </Badge>
        </div>
      </div>
      <Divider className={classes.divider} />
    </ListItem>
  )
}

export default TagItem
