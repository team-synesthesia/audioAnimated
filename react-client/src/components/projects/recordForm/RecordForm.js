import * as React from "react";

import { Box } from "@mui/material";

import MultiFilePlayer from "../MultiFilePlayer";

export default function RecordForm({ selectedFiles }) {
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

  return (
    <React.Fragment>
      <Box>
        <MultiFilePlayer
          title={"Record"}
          files={files}
          inSection={false}
          sectionNumber={null}
          setGPUconfig={null}
          renderGraphics={false}
        />
      </Box>
    </React.Fragment>
  );
}
