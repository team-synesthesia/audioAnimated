import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import SectionColumn from "./SectionColumn";

export default function Sections({
  sections,
  sectionDuration,
  userId,
  projectId,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0} rows={12}>
        {sections && sections.length
          ? sections.map((section) => (
              <Grid key={section.id} item xs={1} md={3}>
                <SectionColumn
                  userId={userId}
                  projectId={projectId}
                  files={section.files}
                  sectionDuration={sectionDuration}
                  sectionNumber={section.sectionNumber}
                  sectionId={section.id}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
