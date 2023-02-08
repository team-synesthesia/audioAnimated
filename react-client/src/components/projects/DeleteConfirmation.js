import React, { useState } from "react";

import { Button, Modal, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';

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
        <DeleteIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button
              color="error"
              onClick={handleClose}
              sx={{ alignSelf: "flex-end" }}
            >
              <CloseIcon />
            </Button>
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
              variant="contained"
              onClick={() => {
                handleDelete(deleteParam);
                handleClose();
              }}
              sx={{ alignSelf: "flex-end", marginTop: "10px" }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteConfirmation;
