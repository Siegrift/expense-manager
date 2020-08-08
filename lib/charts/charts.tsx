import React from 'react'

import PageWrapper from '../components/pageWrapper'

import AllTransactions from './allTransactions'
import ChartWrapper from './chartWrapper'
import RecentBalance from './recentBalance'
import TagPercentages from './tagPercentages'

const Charts = () => {
  return (
    <PageWrapper>
      <ChartWrapper label="Recent balance">
        <RecentBalance />
      </ChartWrapper>

      <ChartWrapper label="All Transactions">
        <AllTransactions />
      </ChartWrapper>

      <ChartWrapper label="Tag percentages">
        <TagPercentages />
      </ChartWrapper>
    </PageWrapper>
  )
}

export default Charts
