import * as React from "react";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

import MultiFilePlayer from "../MultiFilePlayer";

const MESSAGES = {
  begin:
    "Label, you're recording then, click on the microphone to begin recording",
  recording: "Click the Mic again to stop recording",
  stopped: "Recording saved. Hit the 'NEXT' button to listen back",
};

export default function RecordForm({
  selectedFiles,
  projectId,
  userId,
  newFileName,
  setNewFileName,
  poisonPill,
  setPoisonPill,
}) {
  const [files, setFiles] = React.useState([]);
  React.useEffect(() => {
    const _files = [];
    for (const fileName in selectedFiles) {
      if (selectedFiles[fileName]) {
        _files.push({ name: fileName });
      }
    }
    setFiles(_files);
  }, [selectedFiles]);

  const smallPlayer = true;
  const [msgKey, setMsgKey] = React.useState("begin");

  const handleNameChange = (event) => {
    setNewFileName(event.target.value);
  };

  React.useEffect(() => {
    console.log("record msg key", msgKey);
  }, [msgKey]);

  return (
    <React.Fragment>
      <Box>
        {msgKey === "stopped" ? (
          <Alert severity="success">{MESSAGES[msgKey]}</Alert>
        ) : (
          <Alert severity="info">{MESSAGES[msgKey]}</Alert>
        )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Label"
            variant="outlined"
            value={newFileName}
            onChange={handleNameChange}
            sx={{ margin: "auto", width: "25%" }}
          />
        </Box>

        <Box sx={{ margin: "10px" }}>
          <MultiFilePlayer
            msgKey={msgKey}
            setMsgKey={setMsgKey}
            newFileName={newFileName}
            projectId={projectId}
            userId={userId}
            files={files}
            inSection={false}
            sectionNumber={null}
            setGPUconfig={null}
            renderGraphics={false}
            record={true}
            smallPlayer={smallPlayer}
            poisonPill={poisonPill}
            setPoisonPill={setPoisonPill}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
