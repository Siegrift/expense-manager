import { PieDatum, ResponsivePie } from '@nivo/pie'
import { useSelector } from 'react-redux'

import { tagSharesSel } from './selectors'

const NUMBER_OF_TAGS_SHOWN = 10

const TagPercentages = () => {
  const tagPercentages = useSelector(tagSharesSel)
  const data = [
    ...tagPercentages
      .slice(0, NUMBER_OF_TAGS_SHOWN - 1)
      // NOTE: id is displayed in a chart
      .map((t) => ({ ...t, id: t.label })),
    tagPercentages.slice(NUMBER_OF_TAGS_SHOWN - 1).reduce(
      (acc, tagPerc) => ({
        ...acc,
        value: acc.value + tagPerc.value,
      }),
      { id: 'others-id', label: 'other tags', value: 0 },
    ),
  ]
  return (
    <ResponsivePie
      data={(data as unknown) as PieDatum[]}
      margin={{ top: 50, right: 80, bottom: 30, left: 80 }}
      sliceLabel={(v) => `${v.value}%`}
      innerRadius={0.6}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: 'nivo' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: 'color' }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  )
}

export default TagPercentages
