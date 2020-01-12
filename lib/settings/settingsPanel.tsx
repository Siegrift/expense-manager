import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  importExportContent: {
    flexDirection: 'column',
  },
}))

export interface SettingsPanelProps {
  name: string
}

const SettingsPanel: React.FunctionComponent<SettingsPanelProps> = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      aria-label={props.name}
      style={{ textTransform: 'capitalize' }}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{props.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.importExportContent}>
        {props.children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default SettingsPanel
