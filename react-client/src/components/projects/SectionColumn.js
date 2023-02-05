import * as React from "react";
import { Box, Grid, Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Tooltip from "@mui/material/Tooltip";

import { useDispatch } from "react-redux";

import MultiFilePlayer from "./MultiFilePlayer";
import { AssignFileToSection } from "../";
import { deleteSectionAsync } from "../../features";

export default function SectionColumn({
  setSingleSection,
  setSelectedSectionId,
  section,
  files,
  sectionNumber,
  sectionId,
  setCanvasInitialized,
}) {
  const [AssignSectionFormActive, setAssignSectionFormActive] =
    React.useState(null);

  const dispatch = useDispatch();
  const handleDeleteSection = () => {
    dispatch(deleteSectionAsync(sectionId));
  };

  return (
    <Box
      className="sectionColumn"
      id={sectionNumber}
      sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Preview">
          <IconButton
            type="button"
            onClick={() => {
              setSelectedSectionId(sectionId);
              setSingleSection(true);
            }}
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
