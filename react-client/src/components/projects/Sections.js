import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import SectionColumn from "./SectionColumn";
import AddNewSection from "./AddNewSection";

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
                />
              </Grid>
            ))
          : null}
        <AddNewSection projectId={projectId} />
      </Grid>
    </Box>
  );
}
