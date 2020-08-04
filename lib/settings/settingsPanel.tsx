import React from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles({
  importExportContent: {
    flexDirection: 'column',
  },
})

export interface SettingsPanelProps {
  name: string
}

const SettingsPanel: React.FunctionComponent<SettingsPanelProps> = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      aria-label={props.name}
      style={{ textTransform: 'capitalize' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{props.name}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.importExportContent}>
        {props.children}
      </AccordionDetails>
    </Accordion>
  )
}

export default SettingsPanel
