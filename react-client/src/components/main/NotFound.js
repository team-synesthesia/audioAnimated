import React from "react";

import { Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>ERROR: Page not found</h1>
    </Box>
  );
};

export default NotFound;
