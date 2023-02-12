import * as React from "react";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

import MultiFilePlayer from "../MultiFilePlayer";

const MESSAGES = {
  begin: "Hit the play button to listen back",
  playing:
    "If you're satisfied with you're recording, hit the 'DONE', or hit the trash can to delete",
  stopped:
    "If you're satisfied with you're recording, hit the 'DONE', or hit the trash can to delete",
};

export default function PlaybackForm({ selectedFiles, acPlusRefs }) {
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
            files={files}
            inSection={false}
            sectionNumber={null}
            setGPUconfig={null}
            renderGraphics={false}
            record={false}
            smallPlayer={smallPlayer}
            acPlusRef={acPlusRefs ? acPlusRefs.recordPlayback : null}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
