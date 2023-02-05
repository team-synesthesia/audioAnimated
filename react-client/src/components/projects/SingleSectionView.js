import * as React from "react";
import { Box, Grid, Button } from "@mui/material";

import { SectionButtons } from "./SectionButtons";
import MultiFilePlayer from "./MultiFilePlayer";
import { AssignFileToSection } from "../";

import { GPU } from "./GPU/GPU";

export default function SingleSectionView({
  singleSection,
  setSingleSection,
  handleDeleteSection,
  section,
  files,
  sectionNumber,
  sectionId,
}) {
  const [AssignSectionFormActive, setAssignSectionFormActive] =
    React.useState(null);

  const [GPUconfig, setGPUconfig] = React.useState({});
  const [canvasInitialized, setCanvasInitialized] = React.useState(false);

  const sectionAnimationRef = React.useRef();

  GPU({
    GPUconfig,
    gpuDivRef: sectionAnimationRef.current,
    canvasInitialized,
    sectionNumberx: sectionNumber,
    setCanvasInitialized,
  });

  const togglePreviewOnClick = () => {
    setSingleSection(false);
  };

  return (
    <Box
      sx={{
        marginLeft: "max(16vw,152px)",
        display: "flex",
        flexDirection: "row",
        gap: "1vw",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
        <SectionButtons
          singleSection={singleSection}
          togglePreviewOnClick={togglePreviewOnClick}
          previewTitle={"Preview"}
          handleDeleteSection={handleDeleteSection}
          sectionId={sectionId}
        />
        <MultiFilePlayer
          title={`Section ${sectionNumber}`}
          files={files}
          sectionNumber={sectionNumber}
          inSection={true}
          setGPUconfig={setGPUconfig}
          renderGraphics={true}
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
      <div
        id="sectionAnimation"
        ref={sectionAnimationRef}
        style={{
          marginTop: "36px",
          marginRight: "4vw",
          flexShrink: "0",
          width: 640,
          height: 480,
          backgroundColor: "blue",
        }}
      ></div>
    </Box>
  );
}
