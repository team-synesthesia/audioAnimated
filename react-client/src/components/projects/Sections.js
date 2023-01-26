import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileColumn from "./FileColumn";

export default function Sections({ sections, projectFileCount }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} rows={12}>
        {sections && sections.length
          ? sections.map((section) => (
              <Grid key={section.id} item xs={6} md={8}>
                {`Section: ${section.sectionNumber}`}
                <FileColumn
                  files={section.files}
                  projectFileCount={projectFileCount}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
