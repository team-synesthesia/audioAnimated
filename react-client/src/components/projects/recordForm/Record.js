import * as React from "react";
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
import Review from "./Review";

const steps = ["Select Tracks", "Record", "Add to your project"];

function getStepContent(
  step,
  userId,
  projectId,
  selectedFiles,
  setSelectedFiles,
  availableFiles
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
        />
      );
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Record({ availableFiles, userId, projectId }) {
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

  const handleBack = () => {
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
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order
              confirmation, and will send you an update when your order has
              shipped.
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
              availableFiles
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
                {activeStep === steps.length - 1 ? "Place order" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
        {/* </Paper> */}
      </Container>
    </div>
  );
}
