import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import AutoIcon from '@material-ui/icons/BrightnessAuto'
import EuroIcon from '@material-ui/icons/Euro'
import RecentlyUsedIcon from '@material-ui/icons/EventAvailable'
import NotRecentlyUsedIcon from '@material-ui/icons/EventBusy'
import TotalTxsIcon from '@material-ui/icons/PostAddTwoTone'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import { map } from '@siegrift/tsfunct'
import classNames from 'classnames'
import format from 'date-fns/format'
import Router from 'next/router'
import React, { useState } from 'react'

import { Tag, Transaction } from '../addTransaction/state'
import AmountField from '../components/amountField'
import AppBar from '../components/appBar'
import Paper from '../components/paper'
import { formatBoolean, isAmountInValidFormat } from '../shared/utils'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  amount: { width: '100%' },
  label: { width: '100%' },
}))

interface TagDetailsProps {
  appBarTitle: string
  tag: Tag
  onSave: (tag: Tag) => void
  onRemove?: () => void
  stats?: {
    totalTxs: number
    moneyInvolvedInTxs: number
    latestTransaction: Transaction | null
    isRecentlyUsed: boolean
    isRecurring: boolean
  }
}

const isValidDefaultAmount = (amount: string) => {
  return !amount || isAmountInValidFormat(amount)
}

interface UsageStatRowProps {
  label: string
  value: string | number | boolean
  Icon: React.ComponentType<SvgIconProps>
  iconColor?: SvgIconProps['color']
}

const UsageStatRow: React.FC<UsageStatRowProps> = ({
  label,
  value,
  Icon,
  iconColor,
}) => {
  return (
    <div style={{ display: 'flex', marginBottom: 2 }}>
      <Icon
        style={{ marginRight: 5, width: '0.8em' }}
        color={iconColor || 'primary'}
      />
      <Typography
        variant="body2"
        component="span"
        style={{ alignSelf: 'center', flex: 1 }}
      >
        {label}
      </Typography>
      <Typography variant="button" style={{ alignSelf: 'right' }}>
        {typeof value === 'boolean' ? formatBoolean(value) : value}
      </Typography>
    </div>
  )
}

const TagDetails = ({
  tag,
  stats,
  appBarTitle,
  onSave,
  onRemove,
}: TagDetailsProps) => {
  const classes = useStyles()

  const [tagName, setTagName] = useState(tag.name)
  const [isAutotag, setIsAutotag] = useState(tag.automatic)
  const [amount, setAmount] = useState(
    tag.defaultAmount ? tag.defaultAmount : '',
  )
  const [shouldValidate, setShouldValidate] = useState({
    tagName: false,
    amount: false,
  })
  const onRemoveTag = () => {
    onRemove!()
    Router.push('/tags')
  }

  return (
    <>
      <AppBar
        appBarTitle={appBarTitle}
        returnUrl="/tags"
        onSave={() => {
          if (isValidDefaultAmount(amount) && tagName) {
            onSave({
              ...tag,
              name: tagName,
              automatic: isAutotag,
              defaultAmount: amount,
            })
            Router.push('/tags')
          } else {
            // FIXME: tsfunct feature
            setShouldValidate(
              // @ts-ignore
              map(shouldValidate, (_, key) => ({
                key,
                value: true,
              })),
            )
          }
        }}
        onRemove={onRemove && onRemoveTag}
      />

      <div className={classes.root}>
        <Paper>
          <TextField fullWidth disabled label="Id" value={tag.id} />

          <TextField
            className={classes.row}
            fullWidth
            label="Tag name"
            value={tagName}
            onChange={(e) => {
              setShouldValidate((obj) => ({ ...obj, tagName: true }))
              setTagName(e.target.value)
            }}
            error={shouldValidate.tagName && tagName === ''}
          />

          <AmountField
            isValidAmount={isValidDefaultAmount}
            shouldValidateAmount={shouldValidate.amount}
            value={amount}
            onChange={(newAmount) => {
              setAmount(newAmount)
              setShouldValidate((obj) => ({ ...obj, amount: true }))
            }}
            label="Default transaction amount"
            className={classNames(classes.amount, classes.row)}
          />

          <FormControlLabel
            classes={{ root: classNames(classes.row), label: classes.label }}
            style={{ flex: 1, width: '100%' }}
            control={
              <Checkbox
                checked={isAutotag}
                onChange={() => setIsAutotag(!isAutotag)}
                value="checkedA"
                inputProps={{
                  'aria-label': 'primary checkbox',
                }}
              />
            }
            label={
              <div style={{ display: 'flex' }}>
                <Typography
                  variant="body2"
                  component="span"
                  style={{ alignSelf: 'center' }}
                >
                  Automatic tag
                </Typography>
                <AutoIcon style={{ marginLeft: 4 }} color="primary" />
              </div>
            }
          />
        </Paper>
        {stats && (
          <Paper
            className={classes.row}
            style={{ flexDirection: 'column' }}
            label="Usage stats"
          >
            <UsageStatRow
              label="Transaction occurences"
              value={stats.totalTxs}
              Icon={TotalTxsIcon}
            />
            <UsageStatRow
              label="Money involved"
              value={stats.moneyInvolvedInTxs}
              Icon={EuroIcon}
            />
            <UsageStatRow
              label="In recurring transaction"
              value={stats.isRecurring}
              Icon={RepeatOneIcon}
            />
            <UsageStatRow
              label="Last used in transaction"
              value={
                stats.latestTransaction
                  ? format(stats.latestTransaction.dateTime, 'dd/MM/yyyy')
                  : 'never'
              }
              Icon={
                stats.isRecentlyUsed ? RecentlyUsedIcon : NotRecentlyUsedIcon
              }
              iconColor={stats.isRecentlyUsed ? 'primary' : 'secondary'}
            />
          </Paper>
        )}
      </div>
    </>
  )
}

export default TagDetails
