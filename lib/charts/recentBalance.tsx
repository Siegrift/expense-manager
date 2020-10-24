import React, { useCallback, useState } from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Line } from '@nivo/line'
import format from 'date-fns/format'
import { useSelector } from 'react-redux'

import { CURRENCIES } from '../shared/currencies'
import { useIsBigDevice } from '../shared/hooks'
import { mainCurrencySel } from '../shared/selectors'
import { formatMoney } from '../shared/utils'

import { recentBalanceDataSel, displayDataSel, DisplayMode } from './selectors'

const DATE_FORMAT = 'd.MM'
const SLICE_DATE_FORMAT = 'd.MM.yyyy'

interface Props {
  width: number
  height: number
  hideToggles?: boolean
}

const RecentBalance = ({ width, height, hideToggles }: Props) => {
  const mainCurrency = useSelector(mainCurrencySel)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('best-fit')
  const isBigDevice = useIsBigDevice()
  const overridenDisplayMode = !isBigDevice ? 'best-fit' : displayMode

  const { daysToDisplay, xAxisMergeSize } = useSelector(
    displayDataSel(width, overridenDisplayMode),
  )

  const { days, formattedDays, data } = useSelector(
    recentBalanceDataSel(daysToDisplay, DATE_FORMAT),
  )

  const showSlice = useCallback(
    ({ slice }: any) => {
      if (!mainCurrency) return null
      return (
        <div
          style={{
            background: 'white',
            padding: '9px 12px',
            border: '1px solid #ccc',
            transform:
              // move the left tooltips a bit to the right
              daysToDisplay - slice.points[0].index < daysToDisplay / 4
                ? 'translateX(-60px)'
                : 'none',
          }}
        >
          {overridenDisplayMode === 'all' &&
            `Date: ${format(
              days[slice.points[0].data.index],
              SLICE_DATE_FORMAT,
            )}`}
          {slice.points.map((point: any) => (
            <div
              key={point.id}
              style={{
                color: point.serieColor,
                padding: '3px 0',
              }}
            >
              <strong>
                {formattedDays[point.x]}
                {point.serieId === 'income' ? '+' : '-'}
                {formatMoney(point.data.y, mainCurrency)}
              </strong>
            </div>
          ))}
        </div>
      )
    },
    [overridenDisplayMode, formattedDays, daysToDisplay, mainCurrency],
  )

  return (
    <div
      style={{
        position:
          'relative' /* to make sure the toggle absolutely positioned toggle buttons are scoped */,
      }}
    >
      <Line
        width={width}
        height={height}
        data={data}
        margin={{ top: 30, right: 15, bottom: 40, left: 50 }}
        xScale={{
          type: 'point',
        }}
        enableGridX={false}
        yScale={{ type: 'linear' }}
        enableGridY={true}
        colors={{ datum: 'color' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          format: (v) =>
            (v as number) % xAxisMergeSize === 0 ? formattedDays[`${v}`] : '',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          format: (v) =>
            `${v} ${mainCurrency ? CURRENCIES[mainCurrency].symbol : ''}`,
        }}
        pointSize={3}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea
        enableSlices="x"
        curve="monotoneX"
        sliceTooltip={showSlice}
        animate={false}
      />
      {!hideToggles && isBigDevice && (
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={(_, newDisplayMode) => {
            if (newDisplayMode !== null) setDisplayMode(newDisplayMode)
          }}
          style={{
            position: 'absolute',
            top: -5,
            padding: '0 10px',
            right: 5,
          }}
        >
          <ToggleButton style={{ padding: '0 10px' }} value="best-fit">
            Best fit
          </ToggleButton>
          <ToggleButton style={{ padding: '0 10px' }} value="all">
            All
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </div>
  )
}
export default RecentBalance
