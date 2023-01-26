import React from "react";
import { Container, Grid, Button, Card, CardMedia } from "@mui/material";

/**
 * COMPONENT
 */
const SplashPage = (props) => {
  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <h1>Audio Animated</h1>
        </Grid>
        <Grid item sm={12} md={6} lg={8}>
          <Card>
            <CardMedia
              component="img"
              image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg"
            />
          </Card>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <h3>Your music, in the third dimension</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Button variant="contained" href="/signup">
              Get started for free
            </Button>
            <p>
              Already have an account? Login
              <Button variant="text" href="/login">
                here
              </Button>
            </p>
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <h3>Audio Recording Description</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Container>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg"
              sx={{ height: "100vh" }}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <h3>Audio Recording Description</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Container>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg"
              sx={{ height: "100vh" }}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <h3>Animation Description</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default SplashPage;
