import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileColumn from "./FileColumn";

export default function Sections({
  sections,
  sectionDuration,
  projectFileCount,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0} rows={12}>
        {sections && sections.length
          ? sections.map((section) => (
              <Grid key={section.id} item xs={1} md={3}>
                <FileColumn
                  files={section.files}
                  sectionDuration={sectionDuration}
                  projectFileCount={projectFileCount}
                  sectionNumber={section.sectionNumber}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
