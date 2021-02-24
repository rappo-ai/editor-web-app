import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog'; 
import AddIcon from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

export default function CustomModalDemo() {
 
  const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'space-between'
  }
}));
 
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState('xl'); 

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  const classes = useStyles();

   
   
  
 

  

  return (
    <Dialog
      fullScreen
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          padding: 0,
          display: 'flex'
        }
      }}
    >
      <DialogActions className={classes.root} >
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <DialogTitle fontWeight='bold'>
          Dialog Blocks
        </DialogTitle>
        <AddIcon fontSize='large' />
      </DialogActions>
      <List>
        {items.map((item) => (
          <ListItem button onClick={() => handleListItemClick(email)} key={email}>
           
            <ListItemText primary={item} />
          </ListItem>
        ))}
        </List>
       
    </Dialog>
    
  );
}
export default function CustomModal() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <CustomModalDemo selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );

  }