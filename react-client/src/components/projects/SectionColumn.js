import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import FileCard from "./FileCard";
import Player from "./Player";

export default function SectionColumn({
  acPlusRef,
  files,
  totalFiles,
  sectionNumber,
  sectionDuration,
}) {
  const playSection = () => {
    // not built for section 1 yet
    // console.log(Object.keys(acPlusRef.current.audioBuffers));
    if (Object.keys(acPlusRef.current.audioBuffers).length) {
      if (Number(sectionNumber) !== 1) {
        const fileId1 = files[0].id;
        const fileId2 = files[1].id;
        console.log(fileId1);
        console.log(fileId2);
        acPlusRef.current.play2(fileId1, fileId2);
      }
    }
  };

  // const playSection = () => {
  //   console.log(Object.keys(acPlusRef.current.audioBuffers));
  //   acPlusRef.current.playSound(
  //     acPlusRef.current.audioBuffers["1"],
  //     0,
  //     5,
  //     0,
  //     3
  //   );
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Player
            title={`Section ${sectionNumber}`}
            sectionNumber={sectionNumber}
            playOnClick={playSection}
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
