import * as React from "react";
import { Box, Grid, Button } from "@mui/material";

import { SectionButtons } from "./SectionButtons";
import MultiFilePlayer from "./MultiFilePlayer";
import { AssignFileToSection } from "../";

export default function SectionColumn({
  singleSection,
  setSingleSection,
  setSelectedSectionId,
  section,
  files,
  sectionNumber,
  sectionId,
  handleDeleteSection,
}) {
  const [AssignSectionFormActive, setAssignSectionFormActive] =
    React.useState(null);

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
        <Button
          type="button"
          onClick={() => setAssignSectionFormActive(sectionNumber)}
        >
          Add a file
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => setAssignSectionFormActive(null)}
          sx={
            sectionNumber !== AssignSectionFormActive
              ? { display: "none" }
              : { display: "block" }
          }
        >
          X
        </Button>
      </Grid>
      <Grid
        item
        xs={6}
        sx={
          sectionNumber !== AssignSectionFormActive
            ? { display: "none" }
            : { display: "block" }
        }
      >
        <AssignFileToSection
          section={section}
          sectionId={sectionId}
          setAssignSectionFormActive={setAssignSectionFormActive}
        />
      </Grid>
    </Box>
  );
}
