import * as React from "react";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Container } from "@mui/material";

import FormGroup from "@mui/material/FormGroup";

export default function SelectTracksForm({
  selectedFiles,
  setSelectedFiles,
  availableFiles,
}) {
  const names = Object.keys(availableFiles);

  const handleCheckBox = (name, checked) => {
    const fileObj = { ...selectedFiles };
    fileObj[name] = checked;
    setSelectedFiles(fileObj);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Select Tracks to play along with whilst you're recording:
      </Typography>
      {/* <Box> */}
      <Container
        sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <FormGroup>
          {names && names.length
            ? names.map((name) => (
                <FormControlLabel
                  key={name}
                  control={<Checkbox defaultChecked />}
                  label={name}
                  name={name}
                  onChange={(_, value) => handleCheckBox(name, value)}
                />
              ))
            : null}
        </FormGroup>
      </Container>
    </React.Fragment>
  );
}
