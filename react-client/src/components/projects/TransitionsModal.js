import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import FileUploadForm from "./FileUploadForm";
import { FileOptions } from "../";
import Checkout from "./recordForm/Checkout";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function SwitchComponent({
  projectId,
  userId,
  handleClose,
  type,
  clickedFile,
}) {
  switch (type) {
    case "uploadFile":
      return (
        <FileUploadForm
          projectId={projectId}
          userId={userId}
          handleClose={handleClose}
        />
      );

    case "changeGraphicsFn":
      return <div>Phil's graphics form component will go here</div>;

    case "fileOptions":
      return (
        <FileOptions handleClose={handleClose} clickedFile={clickedFile} />
      );

    case "record":
      return <Checkout />;

    default:
      return null;
  }
}

export default function TransitionsModal({
  projectId,
  userId,
  open,
  handleClose,
  type,
  clickedFile,
}) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <SwitchComponent
              projectId={projectId}
              userId={userId}
              handleClose={handleClose}
              type={type}
              clickedFile={clickedFile}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
