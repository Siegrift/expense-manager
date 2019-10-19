import { createStyles, makeStyles, Theme } from '@material-ui/core'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import ListIcon from '@material-ui/icons/List'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { ComponentType } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setCurrentScreen } from '../actions'
import { ScreenTitle, State } from '../state'
import { redirectTo } from '../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNav: {
      // hide bottom navigation when keyboard is up
      ['@media (max-height:500px)']: {
        display: 'none',
      },
      width: '100%',
      position: 'fixed',
      bottom: 0,
    },
  }),
)

interface NavigationItem {
  screen: ScreenTitle
  Icon: ComponentType<SvgIconProps>
}

const navigationItems: NavigationItem[] = [
  { screen: 'add', Icon: AddCircleOutlineIcon },
  { screen: 'transactions', Icon: ListIcon },
  { screen: 'charts', Icon: BarChartIcon },
  { screen: 'settings', Icon: SettingsIcon },
]

const Navigation = () => {
  const currentScreen = useSelector((state: State) => state.currentScreen)
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <BottomNavigation
      value={currentScreen}
      onChange={(event, newValue) => {
        dispatch(setCurrentScreen(newValue))
      }}
      showLabels
      className={classes.bottomNav}
    >
      {navigationItems.map(({ screen, Icon }) => (
        // NOTE: BottomNavigationAction must be a direct child of BottomNavigation
        <BottomNavigationAction
          onClick={() => redirectTo(`/${screen}`)}
          label={screen}
          value={screen}
          icon={<Icon />}
          style={{ textTransform: 'capitalize' }}
          key={screen}
        />
      ))}
    </BottomNavigation>
  )
}

export default Navigation