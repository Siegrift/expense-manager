// https://github.com/mui-org/material-ui/issues/13394
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: { main: '#a5790a' },
  },
})

export default theme
