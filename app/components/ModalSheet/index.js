import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  root: {
    justifyContent: 'space-between',
  },
});

export default function ModalSheet(props) {
  const classes = useStyles();

  const handleClose = value => {
    props.onClose(value);
  };

  const handleListItemClick = value => {
    props.onClose(value);
  };
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState('xl');
  return (
    <Dialog
      onClose={handleClose}
      fullScreen
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={props.open}
      PaperProps={{
        style: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          padding: 0,
          display: 'flex',
        },
      }}
    >
      <DialogActions className={classes.root}>
        <Button
          id="button-left"
          onClick={() => handleClose(props.buttonLeft)}
          color="primary"
        >
          {props.buttonLeft}
        </Button>
        <DialogTitle id="modal-sheet-title" fontWeight="bold">
          {props.title}
        </DialogTitle>
        <AddIcon fontSize="large" onClick={props.children} />
      </DialogActions>

      <List id="modal-sheet-content">
        {props.items.map(item => (
          <ListItem button onClick={() => handleListItemClick(item)} key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
