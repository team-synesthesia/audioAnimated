import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Card, Button, Input } from "@mui/material";

import { createProjectAsync } from "../../features";

const AddNewProject = () => {
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
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container sx={{ margin: "10px" }}>
          <Grid item xs={4}>
            <label htmlFor="projectName">Project Name: </label>
          </Grid>
          <Grid item xs={4}>
            <Input
              name="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              margin: "5px",
            }}
          >
            <Button variant="contained" type="submit">
              Create Project
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default AddNewProject;
