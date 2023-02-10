import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Card, Button, Input, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { createProjectAsync } from "../../features";
import { style } from "./TransitionsModal";

const AddNewProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.me.id);
  const projects = useSelector((state) => state.allProjects);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      setName(`Project ${projects.length + 1}`);
    }

    const { payload } = await dispatch(createProjectAsync({ userId, name }));
    setName("");

    navigate(`${payload.id}`);
  };

  return (
    <Card variant="outlined" sx={{ display: "flex", flexDirection: "column" }}>
      <Button variant="contained" onClick={handleOpen}>
        Create New Project
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button color="error" size="small" onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <div>
                <label htmlFor="projectName">Project Name: </label>
                <Input
                  name="projectName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button
                variant="contained"
                size="small"
                type="submit"
                sx={{ alignSelf: "flex-end", marginTop: "15px" }}
              >
                Create Project
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Card>
  );
};

export default AddNewProject;
