import React, { useCallback, useState } from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Line } from '@nivo/line'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { useSelector } from 'react-redux'

import { CURRENCIES } from '../shared/currencies'
import { useIsBigDevice } from '../shared/hooks'
import { mainCurrencySel } from '../shared/selectors'
import { formatMoney } from '../shared/utils'
import { DateRange } from '../types'

import { recentBalanceDataSel, displayDataSel, DisplayMode } from './selectors'

const AXIS_DATE_FORMAT = 'd.MM'
const SLICE_DATE_FORMAT = 'd.MM.yyyy'

interface Props {
  width: number
  height: number
  dateRange?: DateRange
}

const RecentBalance = ({ width, height, dateRange }: Props) => {
  const mainCurrency = useSelector(mainCurrencySel)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('best-fit')
  const isBigDevice = useIsBigDevice()
  const overridenDisplayMode = !isBigDevice ? 'best-fit' : displayMode

  const { daysToDisplay, xAxisMergeSize, ...computedDateRange } = useSelector(
    displayDataSel(width, overridenDisplayMode, dateRange),
  )

  const { data } = useSelector(
    recentBalanceDataSel(daysToDisplay, computedDateRange),
  )

  if (data.length > 500) return null

  const showSlice = useCallback(
    ({ slice }: any) => {
      if (!mainCurrency) return null

      return (
        <div
          style={{
            background: 'white',
            padding: '9px 12px',
            border: '1px solid #ccc',
          }}
        >
          {overridenDisplayMode === 'all' &&
            `Date: ${format(
              addDays(computedDateRange.start, slice.points[0].data.index),
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
                {point.serieId === 'income' ? '+' : '-'}
                {formatMoney(point.data.y, mainCurrency)}
              </strong>
            </div>
          ))}
        </div>
      )
    },
    [overridenDisplayMode, daysToDisplay, mainCurrency],
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
          format: (v) => {
            return (v as number) % xAxisMergeSize === 0
              ? format(
                  addDays(computedDateRange.start, v as number),
                  AXIS_DATE_FORMAT,
                )
              : ''
          },
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
      {!dateRange && isBigDevice && (
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
