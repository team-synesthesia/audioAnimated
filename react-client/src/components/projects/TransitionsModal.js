import * as React from "react";
import FileUploadForm from "./FileUploadForm";
import { FileOptions } from "../";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

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
            {type === "uploadFile" ? (
              <FileUploadForm
                projectId={projectId}
                userId={userId}
                handleClose={handleClose}
              />
            ) : type === "changeGraphicsFn" ? (
              <div>Phil's graphics form component will go here</div>
            ) : type === "fileOptions" ? (
              <FileOptions
                handleClose={handleClose}
                clickedFile={clickedFile}
              />
            ) : null}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
