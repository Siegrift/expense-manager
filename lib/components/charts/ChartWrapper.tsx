import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  chartWrapper: {
    height: '300px',
    minHeight: '250px',
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
