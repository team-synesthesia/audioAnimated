import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { useDispatch } from "react-redux";
import { deleteFileAsync, fetchSingleProjectAsync } from "../../features";

export default function FileCard({ file, projectId, changeVolume }) {
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    await dispatch(deleteFileAsync(id));
    dispatch(fetchSingleProjectAsync({ projectId }));
  };

  const [onOff, setOnOff] = React.useState(true);

  const [volume, setVolume] = React.useState(100);
  const _changeVolume = (value) => {
    setVolume(value);
    changeVolume(value / 100, file.name);
  };

  const togglerOnOff = (value) => {
    if (value) _changeVolume(100);
    else _changeVolume(0);
    setOnOff(value);
  };

  return (
    <Box sx={{ minWidth: 210 }}>
      <Accordion expanded={onOff}>
        <AccordionSummary>
          <Switch
            checked={onOff}
            onChange={(_, value) => togglerOnOff(value)}
            inputProps={{ "aria-label": "controlled" }}
          />
          <Typography variant="h5" component="div">
            {file.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={(_, value) => _changeVolume(value)}
            />
            <VolumeUp />
          </Stack>
          <Button
            type="button"
            size="small"
            onClick={() => handleDelete(file.id)}
          >
            Delete
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
