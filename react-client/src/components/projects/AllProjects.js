import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createProjectAsync } from "../../features";

export default function AllProjects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.me.id);

  const projects = useSelector((state) => state.allProjects);

  const addNewProject = async () => {
    // This will be updated to use a form in the future where
    // the user will choose a project name
    const name = `Project ${projects.length + 1}`;
    ///
    ///
    const { payload } = await dispatch(createProjectAsync({ userId, name }));
    navigate(`${payload.id}`);
  };

  return (
    <Container sx={{ marginTop: "30px" }}>
      <CssBaseline />
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Your Projects
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Some inspiring writing here about what they can create...
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" onClick={addNewProject}>
              Create New Project
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {projects && projects.length
            ? projects.map((project) => (
                <Grid item key={project.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        16: 9,
                        // pt: "56.25%",
                      }}
                      image="https://source.unsplash.com/random"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.name}
                      </Typography>
                      <Typography>No. of contrbutors: 1 </Typography>
                      <Typography>{`No. of Sample Files: ${5}`}</Typography>
                      <Typography>Project Duration: 3 mins</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">View Final</Button>
                      <Button
                        size="small"
                        onClick={() => {
                          navigate(`/projects/${project.id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Container>
    </Container>
  );
}
