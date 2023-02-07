import * as React from "react";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Divider, Box, Container } from "@mui/material";

import FormGroup from "@mui/material/FormGroup";

export default function SelectTracksForm({
  selectedFiles,
  setSelectedFiles,
  availableFiles,
}) {
  const names = Object.keys(availableFiles);
  const [useMetronome, setUseMetronome] = React.useState(false);

  const handleCheckMetronome = (checked) => {
    setUseMetronome(checked);
  };

  const handleCheckBox = (name, checked) => {
    const fileObj = { ...selectedFiles };
    fileObj[name] = checked;
    setSelectedFiles(fileObj);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Select backing to play along with whilst you're recording:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "30px",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="p" gutterBottom>
            Presets:
          </Typography>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label={"Metronome"}
                name={"metronome"}
                onChange={(_, value) => handleCheckMetronome(value)}
              />
            </FormGroup>
          </Container>
        </Box>
        {names && names.length ? (
          <Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginRight: "30px" }}
            ></Divider>
            <Box>
              <Typography variant="p" gutterBottom>
                Your Tracks
              </Typography>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <FormGroup>
                  {names.map((name) => (
                    <FormControlLabel
                      key={name}
                      control={<Checkbox defaultChecked />}
                      label={name}
                      name={name}
                      onChange={(_, value) => handleCheckBox(name, value)}
                    />
                  ))}
                </FormGroup>
              </Container>
            </Box>
          </Box>
        ) : null}
      </Box>
    </React.Fragment>
  );
}
