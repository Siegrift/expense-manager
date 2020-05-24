import React from 'react'

import { ResponsiveLine } from '@nivo/line'
import { update } from '@siegrift/tsfunct'
import format from 'date-fns/format'
import isWithinInterval from 'date-fns/isWithinInterval'
import subDays from 'date-fns/subDays'
import range from 'lodash/range'
import { useSelector } from 'react-redux'

import { DEFAULT_CURRENCY } from '../shared/currencies'
import { State } from '../state'

interface LineChartData {
  amount: number
  dataIndex: number
  isExpense: boolean
}

const DAYS_TO_DISPLAY = 7

const RecentBalance = () => {
  const transactions = useSelector((state: State) => state.transactions)

  const now = new Date()
  const days = range(DAYS_TO_DISPLAY)
    .map((i) => format(subDays(now, i), 'MM-dd'))
    .reverse()
  const groupedTransactions = Object.values(transactions)
    .filter((tx) =>
      // isWithinInterval is inclusive
      isWithinInterval(tx.dateTime, {
        start: subDays(now, DAYS_TO_DISPLAY - 1),
        end: now,
      }),
    )
    .map(
      (tx): LineChartData => ({
        amount: tx.amount,
        isExpense: tx.isExpense,
        dataIndex: days.indexOf(format(tx.dateTime, 'MM-dd')),
      }),
    )
    .reduce(
      (acc, tx) => update(acc, [tx.dataIndex], (d) => [...d, tx]),
      range(DAYS_TO_DISPLAY).map(() => [] as LineChartData[]),
    )

  const data = [
    {
      id: 'expense',
      color: 'rgb(244, 117, 96)',
      data: days.map((day, index) => ({ x: day, y: 0, index })),
    },
    {
      id: 'income',
      color: 'rgb(38, 217, 98)',
      data: days.map((day, index) => ({ x: day, y: 0, index })),
    },
  ]

  groupedTransactions.forEach((txs, dataInd) => {
    txs.forEach((tx) => {
      data[tx.isExpense ? 0 : 1].data[dataInd].y += tx.amount
    })
  })

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 30, bottom: 40, left: 40 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
      colors={{ datum: 'color' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={3}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh
      enableArea
      enableSlices="x"
      sliceTooltip={({ slice }: any) => {
        return (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              // TODO: maybe this can be styled a bit better
              transform:
                DAYS_TO_DISPLAY - slice.points[0].index < 3
                  ? 'translateX(-60px)'
                  : 'none',
            }}
          >
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
                  {point.data.yFormatted}
                  {/* TODO: not all of amounts are euros */}
                  {DEFAULT_CURRENCY}
                </strong>
              </div>
            ))}
          </div>
        )
      }}
    />
  )
}
export default RecentBalance
