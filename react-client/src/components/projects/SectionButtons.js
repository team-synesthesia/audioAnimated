import { Box, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Tooltip from "@mui/material/Tooltip";

export function SectionButtons({
  singleSection,
  togglePreviewOnClick,
  previewTitle,
  handleDeleteSection,
  sectionId,
  disabled,
}) {
  let sx;
  if (singleSection) {
    sx = { color: "green" };
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Tooltip title={previewTitle}>
        <IconButton
          type="button"
          onClick={() => togglePreviewOnClick(singleSection, sectionId)}
          sx={sx}
          disabled={disabled}
        >
          <BubbleChartIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove Section">
        <IconButton
          type="button"
          onClick={() => handleDeleteSection(sectionId)}
          sx={{ "&:hover": { color: "red" } }}
          disabled={disabled}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
