import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Box, Card, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material";

import { updateProjectAsync } from "../../features";

const EditProjectName = ({ handleClose }) => {
  const { id } = useSelector((state) => state.singleProject);
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(updateProjectAsync(id, { name }));
  };

  return (
    <Card variant="outlined" sx={{ display: "flex", flexDirection: "column" }}>
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
            sx={{ alignSelf: "flex-end", marginTop: "10px" }}
          >
            Create Project
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default EditProjectName;
