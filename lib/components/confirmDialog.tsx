import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  text?: string
  ContentComponent?: React.ReactNode
  title?: string
}

const ConfirmDialog = ({
  open,
  onCancel,
  onConfirm,
  ContentComponent,
  title,
}: Props) => {
  return (
    <div>
      <Dialog onClose={onCancel} disableEnforceFocus open={open}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent style={{ textAlign: 'center' }}>
          {ContentComponent}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="secondary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmDialog
