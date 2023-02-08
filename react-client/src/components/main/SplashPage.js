import React from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * COMPONENT
 */
const SplashPage = (props) => {
  return (
    <Box sx={{ marginTop: "75px" }}>
      <Grid container>
        <Grid item sm={12} md={6} lg={8}>
          <Card sx={{ height: "80vh" }}>
            <iframe
              width="100%"
              height="100%"
              src={"https://www.youtube-nocookie.com/embed/nFD03q4_A58"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube demo"
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "10vh",
          }}
        >
          <Typography variant="h6">Learn More</Typography>
          <KeyboardArrowDownIcon />
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
              image="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
              image="g3.jpg"
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
    </Box>
  );
};

export default SplashPage;
