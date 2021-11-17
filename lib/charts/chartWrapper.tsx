import React from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import classnames from 'classnames'

import Paper from '../components/paper'

const useStyles = makeStyles((theme: Theme) => ({
  chartWrapper: {
    height: '300px',
    width: '100%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

interface Props {
  label?: string
  renderChart: (props: { width: number; height: number }) => React.ReactNode
  Container?: React.FC | string
  className?: string
}

const ChartWrapper: React.FunctionComponent<Props> = ({ label, renderChart, Container = Paper, className }) => {
  const classes = useStyles()

  return (
    <Container className={classnames(classes.chartWrapper, className)}>
      <Typography
        variant="overline"
        display="block"
        style={{
          textAlign: 'center',
          marginBottom: '-25px',
        }}
      >
        {label}
      </Typography>
      <ParentSize>{renderChart}</ParentSize>
    </Container>
  )
}

export default ChartWrapper
