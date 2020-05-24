import { useMediaQuery, useTheme } from '@material-ui/core'

export const useIsBigDevice = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'))
}
