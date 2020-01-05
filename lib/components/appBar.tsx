import MuiAppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import Router from 'next/router'
import React from 'react'

interface AppBarProps {
  returnUrl?: string
  onSave?: () => void
  onRemove?: () => void
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
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => Router.push(returnUrl)}
          >
            <ArrowBackIcon />
          </IconButton>
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
