import React from 'react'

import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

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

const ChartWrapper: React.FunctionComponent<{ label?: string }> = ({
  label,
  children,
}) => {
  const classes = useStyles()

  return (
    <Paper className={classes.chartWrapper}>
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
      {children}
    </Paper>
  )
}

export default ChartWrapper
