import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Grid } from "@mui/material";

import { fetchAllProjectsByUserIdAsync } from "../../features";

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

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>All Projects</h1>
      {!projects.length && <div>You dont have any projects!</div>}
      {/* add Cards!!! */}
      <Grid container>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
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
          Add a Project
        </Grid>
        {projects.length &&
          projects.map((project) => (
            <Grid
              key={project.id}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
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
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default AllProjects;
