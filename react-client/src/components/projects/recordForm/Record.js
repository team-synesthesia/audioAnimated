import * as React from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import SelectTracksForm from "./SelectTracksForm";
import RecordForm from "./RecordForm";
import PlaybackForm from "./PlaybackForm";

import { deleteFileAsync } from "../../../features";

const steps = ["Select Tracks", "Record", "Listen Back"];

function getStepContent(
  step,
  userId,
  projectId,
  selectedFiles,
  setSelectedFiles,
  availableFiles,
  newFileName,
  setNewFileName,
  poisonPill,
  setPoisonPill
) {
  switch (step) {
    case 0:
      return (
        <SelectTracksForm
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          availableFiles={availableFiles}
        />
      );
    case 1:
      return (
        <RecordForm
          selectedFiles={selectedFiles}
          userId={userId}
          projectId={projectId}
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          poisonPill={poisonPill}
          setPoisonPill={setPoisonPill}
        />
      );
    case 2:
      return (
        <PlaybackForm
          selectedFiles={selectedFiles}
          poisonPill={poisonPill}
          setPoisonPill={setPoisonPill}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function Record({ availableFiles, userId, projectId }) {
  const [poisonPill, setPoisonPill] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const dispatch = useDispatch();

  const handleDelete = async (fileName) => {
    dispatch(deleteFileAsync({ deleteParam: fileName, type: "byName" }));
  };

  const [selectedFiles, setSelectedFiles] = React.useState({});

  React.useEffect(() => {
    if (availableFiles && Object.keys(availableFiles).length) {
      const fileObj = {};
      Object.keys(availableFiles).forEach((name) => {
        fileObj[name] = true;
      });
      setSelectedFiles(fileObj);
    }
  }, [availableFiles]);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = async () => {
    // kill player if user did not
    setPoisonPill(true);

    // if user goes back to re-record then delete
    // their recording
    console.log([1, 2].includes(activeStep));
    if ([1, 2].includes(activeStep)) {
      await handleDelete(newFileName);
    }
    setActiveStep(activeStep - 1);
  };
  return (
    <div>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        {/* <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        > */}
        <Typography component="h1" variant="h4" align="center">
          Record
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              Your track has been saved!
            </Typography>
            <Typography variant="subtitle1">
              Use the Project editor to drop your track into a section!
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(
              activeStep,
              userId,
              projectId,
              selectedFiles,
              setSelectedFiles,
              availableFiles,
              newFileName,
              setNewFileName,
              poisonPill,
              setPoisonPill
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? "Done" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
        {/* </Paper> */}
      </Container>
    </div>
  );
}
