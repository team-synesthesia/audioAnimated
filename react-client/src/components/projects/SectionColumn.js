import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AudioContextPlus from "../../audio";
import { useSelector } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";

export default function SectionColumn({
  userId,
  projectId,
  files,
  sectionDuration,
  sectionNumber,
}) {
  const fileNames = files.map((x) => x.name);

  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const [disabled, setDisabled] = React.useState(true);
  const acPlusRef = React.useRef();
  React.useEffect(() => {
    if (!acPlusRef.current) acPlusRef.current = new AudioContextPlus();
  }, []);

  const playPauseSection = async () => {
    await acPlusRef.current.playPauseNSongs(fileNames);
    setIsPlaying(acPlusRef.current.isPlaying);
  };

  const restart = async () => {
    if (!acPlusRef.current.started) return;
    acPlusRef.current.started = false;
    // acPlusRef.current.AC.close();
    // acPlusRef.current.audioBuffers = [];
    playPauseSection();
  };

  const setPlayback = (value) => {
    acPlusRef.current.pause();
    acPlusRef.current.initNSongs(fileNames, value);

    // let wasPlaying;
    // if (acPlusRef.current.isPlaying) {
    //   playPauseSection();
    //   wasPlaying = true;
    // }
    // console.log("set play positon to: ", value);
    // acPlusRef.current.setPlayPosition(value);
    // if (wasPlaying) playPauseSection();
  };

  React.useEffect(() => {
    const createBuffers = async () => {
      // wait for raw audio to load before excuting
      if (!Object.keys(audioRawFiles).length) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const raw = audioRawFiles[file.name];

        // const audioId = `user_${userId}_project_${projectId}_section_${sectionNumber}_file_${fileName}`;
        // let audio = document.getElementById(audioId);
        // if (!audio) {
        //   audio = document.createElement("audio");
        //   audio.setAttribute("id", audioId);
        // }
        const audio = undefined;
        await acPlusRef.current.createAudioBuffers(raw, audio, fileName);
        setDisabled(false);
      }
    };
    createBuffers();
  }, [userId, projectId, sectionNumber, files, audioRawFiles]);

  const [isPlaying, setIsPlaying] = React.useState(false);
  // const playSection = async () => {
  // await playPause();
  // setIsPlaying(acPlusRef.current.isPlaying);
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Player
            title={`Section ${sectionNumber}`}
            isPlaying={isPlaying}
            restart={restart}
            playOnClick={playPauseSection}
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
