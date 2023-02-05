import * as React from "react";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

import MultiFilePlayer from "../MultiFilePlayer";

const MESSAGES = {
  begin: "Click on the microphone to begin recording",
  recording: "Click the Mic again to stop recording",
  stopped: "Recording saved. Hit the 'NEXT' button to listen back",
};

export default function RecordForm({ selectedFiles, projectId, userId }) {
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

  const [msgKey, setMsgKey] = React.useState("begin");
  console.log(msgKey);
  return (
    <React.Fragment>
      <Box>
        {msgKey === "stopped" ? (
          <Alert severity="success">{MESSAGES[msgKey]}</Alert>
        ) : (
          <Alert severity="info">{MESSAGES[msgKey]}</Alert>
        )}
        <Box sx={{ margin: "10px" }}>
          <MultiFilePlayer
            msgKey={msgKey}
            setMsgKey={setMsgKey}
            projectId={projectId}
            userId={userId}
            files={files}
            inSection={false}
            sectionNumber={null}
            setGPUconfig={null}
            renderGraphics={false}
            record={true}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
