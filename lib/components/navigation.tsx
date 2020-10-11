import React, { ComponentType } from 'react'

import { makeStyles } from '@material-ui/core'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import OverviewIcon from '@material-ui/icons/Home'
import ListIcon from '@material-ui/icons/List'
import SettingsIcon from '@material-ui/icons/Settings'
import TagIcon from '@material-ui/icons/Style'
import { useDispatch, useSelector } from 'react-redux'

import { setCurrentScreen } from '../actions'
import { useIsBigDevice } from '../shared/hooks'
import { redirectTo } from '../shared/utils'
import { ScreenTitle, State } from '../state'

const useStyles = makeStyles({
  bottomNav: {
    // hide bottom navigation when keyboard is up
    ['@media (max-height:500px)']: {
      display: 'none',
    },
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
})

interface NavigationItem {
  screen: ScreenTitle
  Icon: ComponentType<SvgIconProps>
  hideOnSmallDevice?: true
}

const navigationItems: NavigationItem[] = [
  { screen: 'add', Icon: AddCircleOutlineIcon },
  { screen: 'overview', Icon: OverviewIcon },
  { screen: 'transactions', Icon: ListIcon, hideOnSmallDevice: true },
  { screen: 'charts', Icon: BarChartIcon, hideOnSmallDevice: true },
  { screen: 'tags', Icon: TagIcon },
  { screen: 'settings', Icon: SettingsIcon },
]

const Navigation = () => {
  const currentScreen = useSelector((state: State) => state.currentScreen)
  const dispatch = useDispatch()
  const classes = useStyles()

  const bigDevice = useIsBigDevice()

  return (
    <BottomNavigation
      value={currentScreen}
      showLabels
      className={classes.bottomNav}
    >
      {navigationItems
        .filter((item) => (bigDevice ? true : !item.hideOnSmallDevice))
        .map(({ screen, Icon }) => (
          // NOTE: BottomNavigationAction must be a direct child of BottomNavigation
          <BottomNavigationAction
            onClick={() => {
              redirectTo(`/${screen}`)
              dispatch(setCurrentScreen(screen))
            }}
            label={screen}
            value={screen}
            icon={<Icon />}
            style={{
              textTransform: 'capitalize',
              minWidth: 'unset',
              padding: 'unset',
            }}
            key={screen}
          />
        ))}
    </BottomNavigation>
  )
}

export default Navigation
