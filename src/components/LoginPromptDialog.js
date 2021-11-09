import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";

function LoginPromptDialog({ isOpen, handleCancel }) {
  const history = useHistory();
  const handleRedirect = () => {
    history.push("/");
  };
  return (
    <div>
      <Dialog
        style={{ zIndex: 1500 }}
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You need to Log In so as to download songs"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handleRedirect}>
            Go to Log In page
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LoginPromptDialog;
