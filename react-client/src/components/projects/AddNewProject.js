import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Card, Button, Input } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { createProjectAsync } from "../../features";

const AddNewProject = ({ setToggleNewProjectForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.me.id);
  const projects = useSelector((state) => state.allProjects);

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
      <Button
        color="error"
        size="small"
        onClick={() => setToggleNewProjectForm(false)}
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

export default AddNewProject;
