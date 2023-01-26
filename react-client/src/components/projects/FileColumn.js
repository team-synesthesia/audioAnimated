import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileCard from "./FileCard";

export default function FileColumn({ files, totalFiles }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {files && files.length
          ? files.map((file) => (
              <Grid key={file.id} item xs={6} md={8}>
                <FileCard file={file} />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
