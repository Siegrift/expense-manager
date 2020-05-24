import React from 'react'

import MuiPaper, { PaperProps as MuiPaperProps } from '@material-ui/core/Paper'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  listContainer: {
    flex: 1,
  },
}))

interface PaperProps extends MuiPaperProps {
  label?: string
  listContainer?: boolean
}

const Paper: React.FC<PaperProps> = ({
  children,
  label,
  className,
  listContainer,
  ...other
}) => {
  const classes = useStyles()

  return (
    <MuiPaper
      {...other}
      className={classNames(
        listContainer ? classes.listContainer : classes.paper,
        className,
      )}
    >
      {label && (
        <Typography
          color="textSecondary"
          gutterBottom
          variant="subtitle1"
          style={{ marginTop: -6 }}
        >
          {label}
        </Typography>
      )}
      {children}
    </MuiPaper>
  )
}

export default Paper
