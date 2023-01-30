import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";

import {
  fetchAllProjectsByUserIdAsync,
  createProjectAsync,
  addProject,
} from "../../features";

const AllProjects = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllProjectsByUserIdAsync(userId));
    };
    fetchData();
  }, [dispatch, userId]);

  const projects = useSelector((state) => state.allProjects);

  const addNewProject = () => {
    // This will be updated to use a form in the future where
    // the user will choose a project name
    const name = `Project ${projects.length + 1}`;
    ///
    ///
    dispatch(createProjectAsync({ userId, name }));
  };

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>All Projects</h1>
      {!projects.length && <div>You dont have any projects!</div>}
      <Grid container>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              backgroundColor: "lightpink",
              display: "flex",
              justifyContent: "center",
              height: "250px",
              width: "250px",
              alignItems: "center",
              margin: "1rem",
            }}
          >
            <CardActionArea onClick={addNewProject}>
              <CardContent>Add a project</CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {projects.length &&
          projects.map((project) => (
            <Grid
              key={project.id}
              item
              xs={12}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  backgroundColor: "lightpink",
                  display: "flex",
                  justifyContent: "center",
                  height: "250px",
                  width: "250px",
                  alignItems: "center",
                  margin: "1rem",
                }}
              >
                <CardContent>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default AllProjects;
