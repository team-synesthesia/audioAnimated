import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileCard from "./FileCard";
import Player from "./Player";

export default function SectionColumn({
  files,
  totalFiles,
  sectionNumber,
  sectionDuration,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Player
            title={`Section ${sectionNumber}`}
            duration={sectionDuration}
          />
        </Grid>
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
