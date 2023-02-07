import React, { useState } from "react";

import { Button, Modal, Box, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteConfirmation = ({ handleDelete, deleteParam, origin }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button color="error" onClick={handleOpen}>
        Delete
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {origin === "AllProjects"
              ? "This project will be permanantly deleted"
              : origin === "FileOptions"
              ? "This file will be permanantly deleted"
              : null}
          </Typography>
          <Button
            onClick={() => {
              handleDelete(deleteParam);
              handleClose();
            }}
            variant="contained"
            color="error"
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteConfirmation;
