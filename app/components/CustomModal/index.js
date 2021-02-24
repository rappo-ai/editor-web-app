import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import AddIcon from "@material-ui/icons/Add";

const items = ["Welcome", "Order"];
const useStyles = makeStyles({
  root: {
    justifyContent: "space-between"
  }
});

function SimpleModal(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("xl");
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
          display: "flex"
        }
      }}
    >
      <DialogActions className={classes.root}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <DialogTitle fontWeight="bold">Dialog Blocks</DialogTitle>
        <AddIcon fontSize="large" />
      </DialogActions>

      <List>
        {items.map((item) => (
          <ListItem button onClick={() => handleListItemClick(item)} key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};

export default function CustomModal() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(items[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open modal
      </Button>
      <SimpleModal
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
