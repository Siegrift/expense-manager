import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

interface Props {
  open: boolean
  onCancel?: (e: React.SyntheticEvent) => void
  onConfirm?: (e: React.SyntheticEvent) => void
  ContentComponent?: React.ReactNode
  title?: string
}

const ConfirmDialog = ({ open, onCancel, onConfirm, ContentComponent, title }: Props) => {
  return (
    <Dialog onClose={onCancel} disableEnforceFocus open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent style={{ textAlign: 'center' }}>
        {/* ContentComponent is sometimes evaluated even after the dialog is closed. */}
        {open && ContentComponent}
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <Button
            onClick={onCancel}
            color="primary"
            onKeyDown={(e) => {
              if (e.key === 'Esc') onCancel(e)
            }}
          >
            Cancel
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color="secondary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onConfirm(e)
            }}
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
