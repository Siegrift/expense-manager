import React, { useCallback, useState } from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Line } from '@nivo/line'
import { useSelector } from 'react-redux'

import { CURRENCIES } from '../shared/currencies'
import { useIsBigDevice } from '../shared/hooks'
import { mainCurrencySel } from '../shared/selectors'

import { recentBalanceDataSel, displayDataSel, DisplayMode } from './selectors'

const DATE_FORMAT = 'd.MM'

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

  const { days, data } = useSelector(
    recentBalanceDataSel(daysToDisplay, DATE_FORMAT),
  )

  const showSlice = useCallback(({ slice }: any) => {
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
          `Date: ${days[slice.points[0].data.index]}`}
        {slice.points.map((point: any) => (
          <div
            key={point.id}
            style={{
              color: point.serieColor,
              padding: '3px 0',
            }}
          >
            <strong>
              {days[point.x]}
              {point.serieId === 'income' ? '+' : '-'}
              {point.data.yFormatted}{' '}
              {mainCurrency && CURRENCIES[mainCurrency].symbol}
            </strong>
          </div>
        ))}
      </div>
    )
  }, [])

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
            (v as number) % xAxisMergeSize === 0 ? days[`${v}`] : '',
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
          onChange={(_, newDisplayMode) => setDisplayMode(newDisplayMode)}
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
