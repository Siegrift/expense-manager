import React from 'react'

import MuiAppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import Link from 'next/link'

interface AppBarProps {
  returnUrl?: string
  onSave?: (e: React.SyntheticEvent) => void
  onRemove?: (e: React.SyntheticEvent) => void
  appBarTitle: string
}

const AppBar: React.FC<AppBarProps> = ({
  returnUrl,
  onSave,
  onRemove,
  appBarTitle,
}) => {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        {returnUrl && (
          <Link href={returnUrl}>
            <IconButton edge="start" color="inherit" aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Link>
        )}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {appBarTitle}
        </Typography>
        {onSave && (
          <IconButton color="inherit" onClick={onSave}>
            <DoneIcon />
          </IconButton>
        )}
        {onRemove && (
          <IconButton color="inherit" onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        )}
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar
