import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import { auth } from 'firebase/app'
import React from 'react'
import { useSelector } from 'react-redux'

import { State } from '../state'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flexGrow: 1,
    },
  }),
)

const Menu = () => {
  const classes = useStyles()
  const isSigned = useSelector((state: State) => state.isSigned)
  const user = isSigned ? auth().currentUser : null

  return (
    <AppBar position="static">
      <Toolbar>
        {/* // TODO: https://material-ui.com/components/drawers/#swipeable-temporary-drawer */}
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {/* TODO: replace with proper screen name */}
          Screen name
        </Typography>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          // TODO: make this part of the menu, not avatar
          onClick={() => auth().signOut()}
        >
          {user ? (
            <Avatar alt={user.displayName!} src={user.photoURL!} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Menu
