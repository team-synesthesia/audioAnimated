import * as React from "react";
import { Box, Grid, Button } from "@mui/material";

import { SectionButtons } from "./SectionButtons";
import MultiFilePlayer from "./MultiFilePlayer";
import { ToggleAssignFileForm } from "./ToggleAssignFileForm";

export default function SectionColumn({
  singleSection,
  setSingleSection,
  setSelectedSectionId,
  section,
  files,
  sectionNumber,
  sectionId,
  handleDeleteSection,
  assignSectionFormActive,
  setAssignSectionFormActive,
}) {
  const togglePreviewOnClick = () => {
    setSelectedSectionId(sectionId);
    setSingleSection(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <SectionButtons
        singleSection={singleSection}
        togglePreviewOnClick={togglePreviewOnClick}
        previewTitle={"Exit Preview"}
        handleDeleteSection={handleDeleteSection}
        sectionId={sectionId}
      />
      <MultiFilePlayer
        title={`Section ${sectionNumber}`}
        files={files}
        sectionNumber={sectionNumber}
        inSection={true}
        renderGraphics={false}
      />
      <Grid item xs={6} md={8} sx={{ display: "flex" }}>
        <ToggleAssignFileForm
          section={section}
          sectionId={sectionId}
          assignSectionFormActive={assignSectionFormActive}
          setAssignSectionFormActive={setAssignSectionFormActive}
        />
      </Grid>
    </Box>
  );
}
