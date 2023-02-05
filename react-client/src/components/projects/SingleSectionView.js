import * as React from "react";
import { Box, Grid, Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Tooltip from "@mui/material/Tooltip";

import MultiFilePlayer from "./MultiFilePlayer";
import { AssignFileToSection } from "../";

export default function SingleSectionView({
  setSingleSection,
  handleDeleteSection,
  section,
  files,
  sectionNumber,
  sectionId,
  sectionAnimationRef,
  setGPUconfig,
  setCanvasInitialized,
}) {
  const [AssignSectionFormActive, setAssignSectionFormActive] =
    React.useState(null);

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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Exit Preview">
            <IconButton
              type="button"
              onClick={() => {
                setSingleSection(false);
              }}
              sx={{ color: "green" }}
            >
              <BubbleChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Section">
            <IconButton
              type="button"
              onClick={() => handleDeleteSection()}
              sx={{ "&:hover": { color: "red" } }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
        }}
      ></div>
    </Box>
  );
}
