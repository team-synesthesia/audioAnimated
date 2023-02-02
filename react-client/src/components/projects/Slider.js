import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import Slider as MUISlider from "@mui/material/Slider";
import { Slider as MUISlider } from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

export default function ContinuousSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <MUISlider aria-label="Volume" value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
      <MUISlider disabled defaultValue={30} aria-label="Disabled slider" />
    </Box>
  );
}
