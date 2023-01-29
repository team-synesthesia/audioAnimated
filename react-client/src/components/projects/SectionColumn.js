import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileCard from "./FileCard";
import Player from "./Player";

export default function SectionColumn({
  acPlusRef,
  disabled,
  files,
  sectionNumber,
  sectionDuration,
}) {
  const setPlayback = (value) => {
    // Need to adjust AC current position in this fn
    // need to figure that out
    // acPlusRef.current.currentTime = value;
  };

  const [isPlaying, setIsPlaying] = React.useState(false);
  const playSection = async () => {
    await acPlusRef.current.playNSongs(files.map((x) => x.name));
    setIsPlaying(acPlusRef.current.isPlaying);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Player
            title={`Section ${sectionNumber}`}
            isPlaying={isPlaying}
            playOnClick={playSection}
            setPlayback={setPlayback}
            disabled={disabled}
            duration={sectionDuration}
          />
        </Grid>
        {files && files.length
          ? files.map((file) => (
              <Grid key={file.id} item xs={6} md={8}>
                <FileCard file={file} />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
