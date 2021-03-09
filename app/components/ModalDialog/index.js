import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

export default function ModalDialog(props) {
  const handleClose = value => {
    props.onClose(value);
  };
  const handleClick = value => {
    props.onClick(value);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            borderRadius: 20,
          },
        }}
        maxWidth="sm"
        fullWidth="true"
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-dialog-title"
      >
        <DialogTitle align="center" id="modal-dialog-title">
          Add Dialog Block
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={props.label}
            type="name"
            fullWidth
            onChange={e => props.setBlockName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(props.buttonLeft)} color="primary">
            {props.buttonLeft}
          </Button>
          <Button
            onClick={() => handleClick(props.buttonRight)}
            color="primary"
          >
            {props.buttonRight}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
