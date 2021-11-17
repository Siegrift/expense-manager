import React, { useState } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Theme, makeStyles } from '@material-ui/core/styles'
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
import format from 'date-fns/format'
import Router from 'next/router'
import { useSelector } from 'react-redux'

import { Tag, Transaction } from '../addTransaction/state'
import AmountField from '../components/amountField'
import AppBar from '../components/appBar'
import ConfirmDialog from '../components/confirmDialog'
import Paper from '../components/paper'
import { CURRENCIES } from '../shared/currencies'
import { defaultCurrencySel } from '../shared/selectors'
import { formatBoolean, isAmountInValidFormat } from '../shared/utils'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paper: {
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
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
  const defaultCurrency = useSelector(defaultCurrencySel)
  const [shouldValidate, setShouldValidate] = useState({
    tagName: false,
    amount: false,
  })
  const [showRemoveTagDialog, setShowRemoveTagDialog] = useState(false)

  const onSaveHandler = () => {
    if (isValidDefaultAmount(amount) && tagName) {
      onSave({
        ...tag,
        name: tagName,
        automatic: isAutotag,
        defaultAmount: amount,
      })

      Router.push('/tags')
    } else {
      setShouldValidate(
        map(shouldValidate, (_, key) => ({
          key,
          value: true,
        })) as typeof shouldValidate,
      )
    }
  }

  if (!defaultCurrency) return null
  return (
    <>
      <AppBar
        appBarTitle={appBarTitle}
        returnUrl="/tags"
        onSave={onSaveHandler}
        onRemove={onRemove ? () => setShowRemoveTagDialog(true) : undefined}
      />

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TextField fullWidth disabled label="Id" value={tag.id} />

          <TextField
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
            className={classes.amount}
            onPressEnter={onSaveHandler}
            currency={CURRENCIES[defaultCurrency]}
          />

          <FormControlLabel
            classes={{ label: classes.label }}
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
          <Paper style={{ flexDirection: 'column' }} label="Usage stats">
            <UsageStatRow
              label="Transaction occurrences"
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

      {showRemoveTagDialog && (
        <ConfirmDialog
          onConfirm={(e) => {
            e.stopPropagation()

            if (onRemove) {
              onRemove()
              Router.push('/tags')
            }
          }}
          onCancel={() => setShowRemoveTagDialog(false)}
          title="Do you really want to remove this tag?"
          open={true}
          ContentComponent="You won't be able to undo this action"
        />
      )}
    </>
  )
}

export default TagDetails
