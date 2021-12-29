import React from 'react'

import ChartWrapper from '../charts/chartWrapper'
import PageWrapper from '../components/pageWrapper'

import AssetPercentages from './assetPercentages'

const Assets = () => {
  return (
    <PageWrapper>
      <ChartWrapper label="Asset percentages" renderChart={() => <AssetPercentages />} />
    </PageWrapper>
  )
}

export default Assets
