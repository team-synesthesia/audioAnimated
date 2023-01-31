import * as React from "react";
import Box from "@mui/material/Box";

import SectionColumn from "./SectionColumn";
import AddNewSection from "./AddNewSection";

export default function Sections({
  sections,
  sectionDuration,
  userId,
  projectId,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {sections && sections.length
        ? sections.map((section) => (
            <SectionColumn
              key={section.id}
              userId={userId}
              projectId={projectId}
              files={section.files}
              sectionDuration={sectionDuration}
              sectionNumber={section.sectionNumber}
            />
          ))
        : null}
      <AddNewSection projectId={projectId} />
    </Box>
  );
}
