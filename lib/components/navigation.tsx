import React, { ComponentType } from 'react'

import { makeStyles } from '@material-ui/core'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import OverviewIcon from '@material-ui/icons/Home'
import ListIcon from '@material-ui/icons/List'
import SettingsIcon from '@material-ui/icons/Settings'
import TagIcon from '@material-ui/icons/Style'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import { setCurrentScreen } from '../actions'
import { useIsBigDevice, useIsVeryBigDevice } from '../shared/hooks'
import { redirectTo } from '../shared/utils'
import { ScreenTitle, State } from '../state'

export const DRAWER_WIDTH = 260

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
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    overflow: 'hidden',
    width: DRAWER_WIDTH,
    borderRight: '2px solid gray',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  listItemText: {
    padding: '8px 16px',
  },
  listItemTextActive: {
    color: '#a5790a',
    fontWeight: 600,
  },
  listItemIconActive: {
    transform: 'scale(1.1)',
    transition: 'all .2s ease-in-out',
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
  const veryBigDevice = useIsVeryBigDevice()

  if (veryBigDevice) {
    return (
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Typography
          variant="h5"
          style={{
            padding: '24px 0',
            display: 'flex',
            fontWeight: 600,
            background: `linear-gradient(45deg, rgba(165,121,10,0.7049370773700105) 0%, rgba(255,235,205,1) 50%, rgba(165,121,10,0.7049370773700105) 100%)`,
          }}
          color="primary"
        >
          <img
            src="../static/coin.svg"
            alt="coin"
            style={{ width: `35px`, margin: '0 8px' }}
          />
          Expense manager
        </Typography>
        <Divider />

        <div>
          {navigationItems
            .filter((item) => (bigDevice ? true : !item.hideOnSmallDevice))
            .map(({ screen, Icon }) => {
              const isActive = currentScreen === screen

              return (
                <React.Fragment key={screen}>
                  <ListItem
                    button
                    onClick={() => {
                      redirectTo(`/${screen}`)
                      dispatch(setCurrentScreen(screen))
                    }}
                    style={{
                      textTransform: 'capitalize',
                      padding: 'unset',
                      backgroundColor: isActive ? 'rgba(0,0,0,0.1)' : '',
                    }}
                  >
                    <ListItemText
                      primary={screen}
                      classes={{
                        root: classes.listItemText,
                        primary: classnames(
                          isActive && classes.listItemTextActive,
                        ),
                      }}
                    />
                    <ListItemIcon
                      style={{ minWidth: 45 }}
                      className={classnames(
                        isActive && classes.listItemIconActive,
                      )}
                    >
                      <Icon color={isActive ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              )
            })}
        </div>
      </Drawer>
    )
  }

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
