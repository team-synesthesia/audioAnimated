import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Box, Card, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../features";

const EditProjectName = ({ handleClose }) => {
  const { name, id } = useSelector((state) => state.singleProject);
  const [newName, setNewName] = useState(name);

  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    const projectId = id;
    const updateData = { name: newName };
    dispatch(updateProjectAsync({ projectId, updateData }));
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Button
        color="error"
        size="small"
        onClick={handleClose}
        sx={{ alignSelf: "flex-end" }}
      >
        <CloseIcon />
      </Button>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "10px" }}>
          <div>
            <label htmlFor="projectName">Edit Project Name: </label>
            <Input
              name="projectName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            size="small"
            type="submit"
            sx={{ alignSelf: "flex-end", marginTop: "10px" }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProjectName;
